import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { IModelCreate as ITierCreateDTO, IModelUpdate as ITierUpdateDTO, Tier } from "@models/Tier";
import { ListTierQuery } from "../controller/request/tier.request";
import { basePagination } from "@utils/base-class/base.paginate";
import { Op } from "sequelize";
import { Sequelize } from "sequelize-typescript";
@Injectable()
export class TierService {
  constructor(private readonly sequelize: Sequelize) {}

  async list(query: ListTierQuery): Promise<{count: number, rows: Tier[]}> {
    const pagination = new basePagination(query.page, query.size);
    const { rows, count } = await Tier.findAndCountAll({
      offset: pagination.getPage(),
      limit: pagination.getSize(),
      order: [['createdAt', 'desc']],
      ...(query?.search && {
        where: {
          [Op.or]: [
            this.sequelize.where(
              this.sequelize.fn('lower', this.sequelize.col('name')),
              {
                [Op.iLike]: `${query.search.trim()}`
              }
            )
          ]
        },
      })
    });

    return { rows, count }
  }

  async create({ name, minPoint, maxPoint }: ITierCreateDTO): Promise<Tier> {
    if (minPoint > maxPoint) {
      throw new BadRequestException('Mohon masukan data minimal dan maksimal point dengan benar');
    }

    const tier = await Tier.create({
      name,
      minPoint,
      maxPoint,
    });

    return tier;
  }

  async getOne(id: number): Promise<Tier> {
    const tier = await Tier.findOne({
      where: { id },
      rejectOnEmpty: new NotFoundException('Mohon maaf, data tier tidak dapat kami temukan'),
    });

    return tier;
  }

  async update(id: number, { name, maxPoint, minPoint }: ITierUpdateDTO): Promise<Tier> {
    if (minPoint > maxPoint) {
      throw new BadRequestException('Mohon masukan data minimal dan maksimal point dengan benar');
    }
    const tier = await Tier.findOne({
      attributes: ['id'],
      where: { id },
      rejectOnEmpty: new NotFoundException('Mohon maaf, data tier tidak dapat kami temukan'),
    });

    await Tier.update({ name, minPoint, maxPoint }, { where: { id: tier.id } });

    return tier.reload();
  }

  async delete(id: number) {
    const tier = await Tier.findOne({
      attributes: ['id'],
      where: { id },
      rejectOnEmpty: new NotFoundException('Mohon maaf, data tier tidak dapat kami temukan'),
    });

    await tier.destroy();
  }
}