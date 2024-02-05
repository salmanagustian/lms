import { MemberReferral } from "@models/MemberReferral";
import { Injectable, NotFoundException } from "@nestjs/common";
import { ICreateReferralDTO } from "./interface/referral.interface";
import { ILoggedUser } from "modules/auth/service/interface/auth.logged.interface";
import { DateTime } from "luxon";
import { Loyalty } from "@models/Loyalty";
import { EEarnedPoint, EEarnedPointCode, EHistoryPointType } from "@utils/enum";
import { Op, Transaction } from "sequelize";
import { Sequelize } from "sequelize-typescript";
import { getFmtTransactionId } from "@utils/helper";
import { LoyaltyBenefit } from "@models/LoyaltyBenefit";
import { Member } from "@models/Member";
import { IModelCreate as ICreateMemberPointHistoryDTO, MemberPointHistory } from "@models/MemberPointHistory";

@Injectable()
export class ReferralService {
  constructor(private readonly sequelize: Sequelize) {}
    
  async createReferral({ persons }: ICreateReferralDTO, { userId }: ILoggedUser): Promise<MemberReferral> {
    const createReferral = await this.sequelize.transaction(async (transaction) => {
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
      
      const loyaltyBenefits = await LoyaltyBenefit.findOne({
        attributes: ['id', 'category', 'config'],
        where: { loyaltyId: availableLoyalty.id, category: EEarnedPoint.COMMUNITY },
        rejectOnEmpty: new NotFoundException(`Mohon maaf, pengaturan loyalty benefits ${availableLoyalty.name} belum tersedia`),
      });

      let { fixed_point: fixedPoint } = loyaltyBenefits.config;
      // fixed point dikalikan dengan seberapa banyak user berhasil get member
      const memberEarnedPoint = persons.length * fixedPoint;

      // handle get format transaction id
      const transactionId = await getFmtTransactionId(EEarnedPointCode.COMMUNITY_REFERRAL, this.sequelize, transaction);

      // handle create transaction referral data
      const transactionData = await MemberReferral.create({
        transactionId,
        loyaltyId: availableLoyalty.id,
        memberId: userId,
        persons,
        transactionDate: DateTime.local().toJSDate(),
      }, { transaction });

      console.log("TRANSACTION DATA: \n", transactionData);
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

    return createReferral;
  }
}