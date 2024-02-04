import { Migration } from '@config/database/migration.provider';
import { DataType } from 'sequelize-typescript';

export const databasePath = __dirname;

export const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.sequelize.transaction(async (transaction) => {
    await queryInterface.createTable('member_transactions', {
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
      transaction_id: {
        type: DataType.STRING(50),
        allowNull: false,
        comment: 'transaction id for referenceing an invoice number',
      },
      amount: {
        type: DataType.DECIMAL(10, 2),
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

    await queryInterface.addIndex('member_transactions', ['loyalty_id', 'member_id'], { where: { deleted_at: null }, transaction });
  });
};
export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.sequelize.transaction(async (transaction) => {
    await queryInterface.removeIndex('member_transactions', ['loyalty_id', 'member_id'], { where: { deleted_at: null }, transaction });
    await queryInterface.dropTable('member_transactions', { transaction });
  });
};
