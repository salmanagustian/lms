import { Migration } from '@config/database/migration.provider';
import { Loyalty } from '@models/Loyalty';
import { LoyaltyBenefit } from '@models/LoyaltyBenefit';
import { LoyaltyPolicy } from '@models/LoyaltyPolicy';
import { EEarnedPoint } from '@utils/enum';
import { DateTime } from 'luxon';
import { Op } from 'sequelize';
import { DataType } from 'sequelize-typescript';

export const databasePath = __dirname;

export const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.sequelize.transaction(async (transaction) => {
    const currentDate = DateTime.now().toFormat('yyyy-MM-dd');
    console.log('CURRENT DATE: \n', currentDate);
    const loyalty = await Loyalty.scope('active').findOne({
      attributes: ['id', 'name'],
      where: {
        endDate: {
          [Op.gte]: currentDate,
        },
      },
    });

    if (loyalty) {
      await LoyaltyPolicy.create({
        loyaltyId: loyalty.id,
        category: EEarnedPoint.TRANSACTIONAL,
        config: {
          min_amount_transaction: 125000,
          qty: 5,
          first_purchase: true
        },
      }, { transaction });

      await LoyaltyBenefit.bulkCreate([
        {
          loyaltyId: loyalty.id,
          category: EEarnedPoint.TRANSACTIONAL,
          config: {
            percentage: null,
            fixed_point: 150,
          },
        },
        {
          loyaltyId: loyalty.id,
          category: EEarnedPoint.COMMUNITY,
          config: {
            fixed_point: 50,
          },
        }
      ], { transaction })
    }
  });
};
export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.sequelize.transaction(async (transaction) => {
  });
};
