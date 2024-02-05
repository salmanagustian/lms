import { Loyalty } from "@models/Loyalty";
import { MemberActivity } from "@models/MemberActivity";
import { Injectable, NotFoundException } from "@nestjs/common";
import { EEarnedPoint, EEarnedPointCode, EHistoryPointType } from "@utils/enum";
import { getFmtTransactionId } from "@utils/helper";
import { DateTime } from "luxon";
import { ILoggedUser } from "modules/auth/service/interface/auth.logged.interface";
import { ICreateActivityDTO } from "./interface/activity.interface";
import { Op } from "sequelize";
import { Sequelize } from "sequelize-typescript";
import { LoyaltyBenefit } from "@models/LoyaltyBenefit";
import { Member } from "@models/Member";
import { IModelCreate as ICreateMemberPointHistoryDTO, MemberPointHistory } from "@models/MemberPointHistory";

@Injectable()
export class ActivityService {
  constructor(private readonly sequelize: Sequelize) {}
  async createActivity({ activityName }: ICreateActivityDTO, { userId }: ILoggedUser): Promise<MemberActivity> {
    const createActivity = await this.sequelize.transaction(async (transaction) => {
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
      
      const memberEarnedPoint = fixedPoint;

      // handle get format transaction id
      const transactionId = await getFmtTransactionId(EEarnedPointCode.COMMUNITY_ACTIVITY, this.sequelize, transaction);

      // handle create transaction referral data
      const transactionData = await MemberActivity.create({
        transactionId,
        loyaltyId: availableLoyalty.id,
        memberId: userId,
        activityName,
        transactionDate: DateTime.local().toJSDate(),
      }, { transaction });

      const memberPointHistory: ICreateMemberPointHistoryDTO = {
        memberId: userId,
        loyaltyId: availableLoyalty.id,
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

    return createActivity;
  }
}