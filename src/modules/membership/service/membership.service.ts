import { Injectable, NotFoundException } from "@nestjs/common";
import { ListMembershipRequest } from "../controller/request/membership.request";
import { Member } from "@models/Member";
import { basePagination } from "@utils/base-class/base.paginate";

@Injectable()
export class MembershipService {
  async list(query: ListMembershipRequest): Promise<{rows: Member[], count: number}> {
    const pagination = new basePagination(query.page, query.size);
    const { rows, count } = await Member.findAndCountAll({
      attributes: ['id', 'name', 'phoneNumber', 'remainedPoint', 'isActive'],
      offset: pagination.getPage(),
      limit: pagination.getSize(),
      include: [
        {
          association: 'user',
          attributes: ['id', 'email'],
          required: true,
        }
      ],
      order: [['createdAt', 'desc']],
    });

    return { rows, count }
  }

  async getOne(id: number): Promise<Member> {
    const memberData = await Member.findOne({
      attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
      where: { id },
      include: [
        {
          association: 'user',
          attributes: ['id', 'email'],
          required: true,
        },
        {
          association: 'pointHistories',
          required: false,
        }
      ],
      rejectOnEmpty: new NotFoundException('Mohon maaf, data member tidak dapat kami temukan'),
    });

    return memberData;
  }
}