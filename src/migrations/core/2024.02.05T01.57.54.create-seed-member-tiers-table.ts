import { Migration } from '@config/database/migration.provider';
import { Loyalty } from '@models/Loyalty';
import { Member } from '@models/Member';
import { MemberTier } from '@models/MemberTier';
import { Tier } from '@models/Tier';
import { DataType } from 'sequelize-typescript';

export const databasePath = __dirname;

export const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.sequelize.transaction(async (transaction) => {
    const members = await Member.findAll({ attributes: ['id'] });
    const loyalty = await Loyalty.findOne({ attributes: ['id'] });
    const tier = await Tier.findOne({ attributes: ['id'], where: { name: 'ROYAL' } });

    if (members.length > 0 && loyalty) {
      for (const member of members) {
        await MemberTier.create({
          loyaltyId: loyalty.id,
          memberId: member.id,
          tierId: tier.id,
        })
      }
    }
  });
};
export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.sequelize.transaction(async (transaction) => {
    // await queryInterface.dropTable('table_name');
  });
};
