import { Migration } from '@config/database/migration.provider';
import { DataType } from 'sequelize-typescript';

export const databasePath = __dirname;

export const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.sequelize.transaction(async (transaction) => {
    await queryInterface.createTable('member_point_histories', {
      id: {
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      member_id: {
        type: DataType.INTEGER,
        allowNull: false,
        references: {
          key: 'id',
          model: 'members',
        }
      },
      transaction_id: {
        type: DataType.STRING(50),
        allowNull: false,
      },
      transaction_date: {
        type: DataType.DATEONLY,
        allowNull: false,
      },
      type: {
        type: DataType.ENUM('earned', 'redeemed'),
        allowNull: false,
      },
      point: {
        type: DataType.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      created_at: DataType.DATE,
      updated_at: DataType.DATE,
      deleted_at: DataType.DATE,
    }, { transaction });

    await queryInterface.addIndex('member_point_histories', ['transaction_id'], { where: { deleted_at: null }, transaction });
  });
};
export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.sequelize.transaction(async (transaction) => {
    await queryInterface.removeIndex('member_point_histories', ['transaction_id'], { where: { deleted_at: null }, transaction });
    await queryInterface.dropTable('member_point_histories', { transaction });
  });
};
