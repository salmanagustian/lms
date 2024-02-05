import { Injectable, NotFoundException, UnprocessableEntityException } from "@nestjs/common";
import { ICreateRedeemPointDTO } from "./interface/redeem-point.interface";
import { ILoggedUser } from "modules/auth/service/interface/auth.logged.interface";
import { Member } from "@models/Member";
import { MemberRedeemPoint } from "@models/MemberRedeemPoint";
import { Loyalty } from "@models/Loyalty";
import { Op } from "sequelize";
import { DateTime } from "luxon";
import { Sequelize } from "sequelize-typescript";
import { IModelCreate as ICreateMemberPointHistoryDTO, MemberPointHistory } from "@models/MemberPointHistory";
import { EHistoryPointType } from "@utils/enum";
import { circularToJSON } from "@utils/helper";

@Injectable()
export class RedeemPointService {
  constructor(private readonly sequelize: Sequelize) {}

  async redeemPoint({redeemedPoint}: ICreateRedeemPointDTO, { userId }: ILoggedUser) {
    return this.sequelize.transaction(async (transaction) => {
      const member = await Member.findOne({
        attributes: ['id', 'earnedPoint'],
        where: { id: userId },
        rejectOnEmpty: new NotFoundException('Mohon maaf, data user tidak dapat kami temukan'),
      }).then((r) => circularToJSON(r));
  
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
  
      // refer to docs: validasi tidak bisa diredeem kalau redeemed poin lebih besar dari earned poin
      // ? apakah seharusnya validasi redeemed point tidak bisa dilakukan jika lebih dari remained point?
      if (redeemedPoint > +member?.earnedPoint) {
        throw new UnprocessableEntityException(`Mohon maaf, kamu belum bisa melakukan redeemed point. Jumlah earned point kamu adalah ${member.earnedPoint} point`);
      }
      
      const redeemPoint = await MemberRedeemPoint.create({
        loyaltyId: availableLoyalty.id,
        memberId: userId,
        redeemedPoint: +redeemedPoint,
        transactionDate: DateTime.local().toJSDate(),
      }, { transaction });

      const memberPointHistory: ICreateMemberPointHistoryDTO = {
        memberId: userId,
        transactionId: '-',
        transactionDate: redeemPoint.transactionDate,
        type: EHistoryPointType.REDEEMED,
        point: +redeemedPoint
      };

      // handle update member earned point to table members
      await Promise.all([
        Member.update({
          remainedPoint: this.sequelize.literal(`remained_point - ${redeemedPoint}`),
          redeemedPoint: this.sequelize.literal(`redeemed_point + ${redeemedPoint}`)
        }, { where: { id: userId }, transaction }),
        MemberPointHistory.create(memberPointHistory, { transaction }),
      ]);

      return { message: `Berhasil melakukan redeem point` }
    });
  }
}