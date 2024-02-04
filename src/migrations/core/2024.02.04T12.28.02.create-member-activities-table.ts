import { Migration } from '@config/database/migration.provider';
import { DataType } from 'sequelize-typescript';

export const databasePath = __dirname;

export const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.sequelize.transaction(async (transaction) => {
    await queryInterface.createTable('member_activities', {
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
      activity_name: {
        type: DataType.STRING(255),
        allowNull: false,
      },
      transaction_date: {
        type: DataType.DATE,
        allowNull: false,
      },
      created_at: DataType.DATE,
      updated_at: DataType.DATE,
      deleted_at: DataType.DATE,
    }, { transaction });

    await queryInterface.addIndex('member_activities', ['member_id'], { where: { deleted_at: null }, transaction });
  });
};
export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.sequelize.transaction(async (transaction) => {
    await queryInterface.removeIndex('member_activities', ['member_id'], { where: { deleted_at: null }, transaction });
    await queryInterface.dropTable('member_activities', { transaction });
  });
};
