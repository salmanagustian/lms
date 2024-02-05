import { Migration } from '@config/database/migration.provider';
import { DataType } from 'sequelize-typescript';

export const databasePath = __dirname;

export const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.sequelize.transaction(async (transaction) => {
    await queryInterface.createTable('member_tiers', {
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
      member_id: {
        type: DataType.INTEGER,
        allowNull: false,
        references: {
          key: 'id',
          model: 'members',
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

    await queryInterface.addIndex('member_tiers', ['loyalty_id', 'member_id'], { transaction });
  });
};
export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.sequelize.transaction(async (transaction) => {
    await queryInterface.removeIndex('member_tiers', ['loyalty_id', 'member_id'], { transaction });
    await queryInterface.dropTable('member_tiers');
  });
};
