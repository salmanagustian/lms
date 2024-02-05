import { Injectable } from "@nestjs/common";
import { ListEarnedPointRequest } from "../controller/request/report.request";
import { basePagination } from "@utils/base-class/base.paginate";
import { Loyalty } from "@models/Loyalty";
import { EHistoryPointType } from "@utils/enum";
import { Member } from "@models/Member";
import { Sequelize } from "sequelize-typescript";
import { Op } from "sequelize";

@Injectable()
export class ReportService {
  constructor(private readonly sequelize: Sequelize) {}
  async getAllEarnedPoint(query: ListEarnedPointRequest) {

    const pagination = new basePagination(query.page, query.size);

    const { rows, count } = await Member.findAndCountAll({
      attributes: ['id', 'name', 'phoneNumber', 'earnedPoint', 'remainedPoint', 'redeemedPoint'],
      offset: pagination.getPage(),
      limit: pagination.getSize(),
      distinct: true,
      include: [
        {
          association: 'loyalty',
          attributes: ['id', 'name'],
          required: true,
          through: { attributes: [] },
        },
        {
          association: 'pointHistories',
          attributes: ['id', 'transactionId', 'transactionDate', 'type', 'point'],
          required: false,
          where: {
            type: EHistoryPointType.EARNED,
          },
        }
      ],
      where: {
        ...(query?.search && {
          [Op.or]: [
            this.sequelize.where(
              this.sequelize.fn('lower', this.sequelize.col('Member.name')),
              {
                [Op.iLike]: `%${query.search.trim()}%`
              }
            )
          ]
        })
      },
    });

    return { rows, count }
  }

  async getAllRedeemedPoint(query: ListEarnedPointRequest) {
    const pagination = new basePagination(query.page, query.size);

    const { rows, count } = await Member.findAndCountAll({
      attributes: ['id', 'name', 'phoneNumber', 'earnedPoint', 'remainedPoint', 'redeemedPoint'],
      offset: pagination.getPage(),
      limit: pagination.getSize(),
      distinct: true,
      include: [
        {
          association: 'loyalty',
          attributes: ['id', 'name'],
          required: true,
          through: { attributes: [] },
        },
        {
          association: 'pointHistories',
          attributes: ['id', 'transactionId', 'transactionDate', 'type', 'point'],
          required: false,
          where: {
            type: EHistoryPointType.REDEEMED,
          },
        }
      ],
      where: {
        ...(query?.search && {
          [Op.or]: [
            this.sequelize.where(
              this.sequelize.fn('lower', this.sequelize.col('Member.name')),
              {
                [Op.iLike]: `%${query.search.trim()}%`
              }
            )
          ]
        })
      },
    });

    return { rows, count }
  }
}