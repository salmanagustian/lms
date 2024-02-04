import { Migration } from '@config/database/migration.provider';
import { DataType } from 'sequelize-typescript';

export const databasePath = __dirname;

export const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.sequelize.transaction(async (transaction) => {
    await queryInterface.createTable('loyalties_tier', {
      id: {
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      loyalty_id: {
        type: DataType.INTEGER,
        allowNull: false,
        references: {
          key: 'id',
          model: 'loyalties',
        },
        onDelete: 'cascade',
        onUpdate: 'restrict',
      },
      tier_id: {
        type: DataType.INTEGER,
        allowNull: false,
        references: {
          key: 'id',
          model: 'tiers',
        },
        onDelete: 'cascade',
        onUpdate: 'restrict',
      }
    }, { transaction });

    await queryInterface.addIndex('loyalties_tier', ['loyalty_id', 'tier_id'], { transaction });
  });
};
export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.sequelize.transaction(async (transaction) => {
    await queryInterface.removeIndex('loyalties_tier', ['loyalty_id', 'tier_id'], { transaction });
    await queryInterface.dropTable('loyalties_tier', { transaction });
  });
};
