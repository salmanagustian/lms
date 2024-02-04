import { Migration } from '@config/database/migration.provider';
import { Loyalty } from '@models/Loyalty';
import { LoyaltyTier } from '@models/LoyaltyTier';
import { Tier } from '@models/Tier';
import { DataType } from 'sequelize-typescript';

export const databasePath = __dirname;

export const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.sequelize.transaction(async (transaction) => {
    const tiers = await Tier.findAll({ attributes: ['id', 'name'] });

    if (tiers.length > 0) {
      const loyalty = await Loyalty.create({
        name: 'Loyalty Program Quater 1 2024',
        startDate: '2024-01-01',
        endDate: '2024-03-31',
      }, { transaction });

      const loyaltiesTier = tiers.reduce((r, v) => {
        r.push({ loyaltyId: loyalty.id, tierId: v.id });
        return r;
      }, []);

      await LoyaltyTier.bulkCreate(loyaltiesTier, { transaction });
    }
  });
};
export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.sequelize.transaction(async (transaction) => {
  });
};
