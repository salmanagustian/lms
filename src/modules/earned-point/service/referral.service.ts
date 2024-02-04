import { MemberReferral } from "@models/MemberReferral";
import { Injectable, NotFoundException } from "@nestjs/common";
import { ICreateReferralDTO } from "./interface/referral.interface";
import { ILoggedUser } from "modules/auth/service/interface/auth.logged.interface";
import { DateTime } from "luxon";
import { Loyalty } from "@models/Loyalty";
import { EEarnedPointCode } from "@utils/enum";
import { Op, Transaction } from "sequelize";
import { Sequelize } from "sequelize-typescript";
import { getFmtTransactionId } from "@utils/helper";

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

      return transactionData;
    });

    return createReferral;
  }
}