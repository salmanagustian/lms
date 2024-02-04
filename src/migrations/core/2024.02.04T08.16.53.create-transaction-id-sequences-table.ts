import { Migration } from '@config/database/migration.provider';
import { DataType } from 'sequelize-typescript';

export const databasePath = __dirname;

export const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.sequelize.transaction(async (transaction) => {
    await queryInterface.createTable('transaction_id_sequences', {
      id: {
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      code: {
        type: DataType.STRING(25),
        allowNull: false,
      },
      date: {
        type: DataType.STRING(25),
        allowNull: false,
      },
      current: {
        type: DataType.SMALLINT,
        allowNull: false,
        defaultValue: 1,
      },
    }, { transaction });

    await queryInterface.addConstraint('transaction_id_sequences', {
      name: 'transaction_id_sequences_code_date_unique_constraint',
      type: 'unique',
      fields: ['code', 'date'],
      transaction,
    });
  });
};
export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.sequelize.transaction(async (transaction) => {
    await queryInterface.removeConstraint('transaction_id_sequences', 'transaction_id_sequences_code_date_unique_constraint', { transaction });
    await queryInterface.dropTable('transaction_id_sequences', { transaction });
  });
};
