import { Injectable, NotFoundException } from "@nestjs/common";
import { Sequelize } from "sequelize-typescript";
import { ICreateTransactionDTO } from "./interface/transaction.interface";
import { ILoggedUser } from "modules/auth/service/interface/auth.logged.interface";
import { DateTime } from "luxon";
import { Loyalty } from "@models/Loyalty";
import { Op, Transaction } from "sequelize";
import { EEarnedPointCode } from "@utils/enum";
import { MemberTransaction } from "@models/MemberTransaction";
import { MemberTransactionItem } from "@models/MemberTransactionItem";
import { getFmtTransactionId } from "@utils/helper";

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
      
      // handle get format transaction id
      const transactionId = await getFmtTransactionId(EEarnedPointCode.TRANSACTIONAL, this.sequelize, transaction);

      // handle transaction items creations
      let amountTotal = items.reduce((res, current) => {
        const subTotal = current.itemPrice * current.itemQty;
        res += subTotal;
        return res;
      }, 0);
     

      // handle create transaction data
      const transactionData = await MemberTransaction.create({
        transactionId,
        loyaltyId: availableLoyalty.id,
        memberId: userId,
        amount: amountTotal,
        transactionDate: DateTime.local().toJSDate(),
      }, { transaction });

      const transactionItems = items.reduce((res, current) => {
        const subTotal = current.itemPrice * current.itemQty;

        res.push({ transactionId:transactionData.id, name: current.itemName, qty: current.itemQty, price: current.itemPrice, subTotal });

        return res;
      }, [] as Array<{ transactionId: number, name: string, qty: number, price: number, subTotal: number }>)

      await MemberTransactionItem.bulkCreate(transactionItems,  { transaction });


      return transactionData;
    });

    return createTransaction;

  }
}