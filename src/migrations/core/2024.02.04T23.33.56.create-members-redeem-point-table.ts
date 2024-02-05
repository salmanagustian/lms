import { Migration } from '@config/database/migration.provider';
import { DataType } from 'sequelize-typescript';

export const databasePath = __dirname;

export const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.sequelize.transaction(async (transaction) => {
    await queryInterface.createTable('member_redeem_points', {
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
          model: 'loyalties'
        },
      },
      member_id: {
        type: DataType.INTEGER,
        allowNull: false,
        references: {
          key: 'id',
          model: 'members'
        },
      },
      redeemed_point: {
        type: DataType.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      transaction_date: {
        type: DataType.DATE,
        allowNull: false,
      },
      created_at: DataType.DATE,
      updated_at: DataType.DATE,
      deleted_at: DataType.DATE,
    }, { transaction });

    await queryInterface.addIndex('member_redeem_points', ['member_id'], { where: { deleted_at: null }, transaction });
  });
};
export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.sequelize.transaction(async (transaction) => {
    await queryInterface.removeIndex('member_redeem_points', ['member_id'], { where: { deleted_at: null }, transaction });
    await queryInterface.dropTable('member_redeem_points', { transaction });
  });
};
