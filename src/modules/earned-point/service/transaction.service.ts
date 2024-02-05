import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { Sequelize } from "sequelize-typescript";
import { ICreateTransactionDTO } from "./interface/transaction.interface";
import { ILoggedUser } from "modules/auth/service/interface/auth.logged.interface";
import { DateTime } from "luxon";
import { Loyalty } from "@models/Loyalty";
import { ForeignKeyConstraintError, Op, Transaction } from "sequelize";
import { EEarnedPoint, EEarnedPointCode, EHistoryPointType } from "@utils/enum";
import { MemberTransaction } from "@models/MemberTransaction";
import { MemberTransactionItem } from "@models/MemberTransactionItem";
import { circularToJSON, getFmtTransactionId } from "@utils/helper";
import { LoyaltyPolicy } from "@models/LoyaltyPolicy";
import { LoyaltyBenefit } from "@models/LoyaltyBenefit";
import { Member } from "@models/Member";
import { IModelCreate as ICreateMemberPointHistoryDTO, MemberPointHistory } from "@models/MemberPointHistory";

@Injectable()
export class TransactionService {
  constructor(private readonly sequelize: Sequelize) {}


  async create({ items }: ICreateTransactionDTO, { userId }: ILoggedUser): Promise<MemberTransaction> {
    const createTransaction = await this.sequelize.transaction(async (transaction) => {
      const currentDate = DateTime.now().toFormat('yyyy-MM-dd');
      const availableLoyalty = await Loyalty.scope('active').findOne({
        attributes: ['id', 'name'],
        where: {
          endDate: {
            [Op.gte]: currentDate,
          }
        },
        rejectOnEmpty: new NotFoundException('Mohon maaf, Loyalty Program sedang tidak tersedia'),
      });

      const [loyaltyPolicies, loyaltyBenefits, haveTransaction] = await Promise.all([
        LoyaltyPolicy.findOne({
          attributes: ['id', 'category', 'config'],
          where: { loyaltyId: availableLoyalty.id, category: EEarnedPoint.TRANSACTIONAL },
          rejectOnEmpty: new NotFoundException(`Mohon maaf, pengaturan loyalty policies ${availableLoyalty.name} belum tersedia`),
        }).then((r) => circularToJSON(r)),
        LoyaltyBenefit.findOne({
          attributes: ['id', 'category', 'config'],
          where: { loyaltyId: availableLoyalty.id, category: EEarnedPoint.TRANSACTIONAL },
          rejectOnEmpty: new NotFoundException(`Mohon maaf, pengaturan loyalty benefit ${availableLoyalty.name} belum tersedia`),
        }).then((r) => circularToJSON(r)),
        MemberTransaction.findOne({
          attributes: ['id'],
          where: { loyaltyId: availableLoyalty.id, memberId: userId },
        }).then((r) => circularToJSON(r)),
      ]);

      let amountTotal = 0;
      let qtyTotal = 0;

      items.forEach((v) => {
        const subTotal = v.itemPrice * v.itemQty;
        amountTotal += subTotal;
        qtyTotal += v.itemQty;
      });

      // handle get format transaction id
      const transactionId = await getFmtTransactionId(EEarnedPointCode.TRANSACTIONAL, this.sequelize, transaction);

      // handle get loyalty policies config
      // 1. amount >= min_amount_transaction = earned point
      // 2. first purchase ? first_purchase && qty >= min qty = earned point
      console.log('HAVE TRANSACTION: \n',haveTransaction);
      console.log('POLICIES CONFIG: \n',loyaltyPolicies.config);
      const { qty, first_purchase, min_amount_transaction: minAmountTransaction } = loyaltyPolicies.config;
      
      // handle get loyalti benefits config
      let memberEarnedPoint = 0;
      let counterPoint = 0;
      let { percentage, fixed_point: fixedPoint } = loyaltyBenefits.config;
      if (percentage !== null) {
        // percentage format ex: 0.20 = 20%;
        fixedPoint = Math.round(+percentage * fixedPoint);
      }

      if (!haveTransaction && first_purchase === true && qtyTotal > +qty ) {
        while (qtyTotal >= +qty) {
          counterPoint += 1;
          qtyTotal -= qty;
        }
      } else if (amountTotal >= minAmountTransaction) {
        let paramAmountTotal = amountTotal;
        while (paramAmountTotal >= minAmountTransaction) {
          counterPoint += 1;
          paramAmountTotal -= minAmountTransaction;
        }
      }

      memberEarnedPoint = counterPoint * fixedPoint;
      // console.log("MEMBER EARNED POINT: \n", memberEarnedPoint);
      // handle create transaction data
      const transactionData = await MemberTransaction.create({
        transactionId,
        loyaltyId: availableLoyalty.id,
        memberId: userId,
        amount: amountTotal,
        transactionDate: DateTime.local().toJSDate(),
      }, { transaction }).catch((e) => {
        if (e instanceof ForeignKeyConstraintError) {
          throw new InternalServerErrorException('Mohon maaf, tidak dapat melakukan proses transaksi untuk saat ini')
        }
        throw e;
      });

      // handle transaction items creations
      const transactionItems = items.reduce((res, current) => {
        const subTotal = current.itemPrice * current.itemQty;
        res.push({ transactionId:transactionData.id, name: current.itemName, qty: current.itemQty, price: current.itemPrice, subTotal });

        return res;
      }, [] as Array<{ transactionId: number, name: string, qty: number, price: number, subTotal: number }>)

      await MemberTransactionItem.bulkCreate(transactionItems,  { transaction });
      
      // console.log("TRANSACTION DATA: \n", transactionData);
      const memberPointHistory: ICreateMemberPointHistoryDTO = {
        memberId: userId,
        // loyaltyId: availableLoyalty.id,
        transactionId: transactionData?.dataValues?.transactionId,
        transactionDate: transactionData?.dataValues?.transactionDate,
        type: EHistoryPointType.EARNED,
        point: memberEarnedPoint
      };

      // handle update member earned point to table members
      await Promise.all([
        Member.update({
          remainedPoint: this.sequelize.literal(`remained_point + ${memberEarnedPoint}`),
          earnedPoint: this.sequelize.literal(`earned_point + ${memberEarnedPoint}`)
        }, { where: { id: userId }, transaction }),
        MemberPointHistory.create(memberPointHistory, { transaction }),
      ]);
   

      return transactionData;
    });

    return createTransaction;

  }
}