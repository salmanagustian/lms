import { Loyalty } from "@models/Loyalty";
import { MemberActivity } from "@models/MemberActivity";
import { Injectable, NotFoundException } from "@nestjs/common";
import { EEarnedPointCode } from "@utils/enum";
import { getFmtTransactionId } from "@utils/helper";
import { DateTime } from "luxon";
import { ILoggedUser } from "modules/auth/service/interface/auth.logged.interface";
import { ICreateActivityDTO } from "./interface/activity.interface";
import { Op } from "sequelize";
import { Sequelize } from "sequelize-typescript";

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

      return transactionData;
    });

    return createActivity;
  }
}