import { Migration } from '@config/database/migration.provider';
import { DataType } from 'sequelize-typescript';

export const databasePath = __dirname;

export const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.sequelize.transaction(async (transaction) => {
    await queryInterface.createTable('member_transaction_items', {
      id: {
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      transaction_id: {
        type: DataType.INTEGER,
        allowNull: false,
        references: {
          key: 'id',
          model: 'member_transactions'
        },
        onDelete: 'cascade',
        onUpdate: 'restrict',
      },
      name: {
        type: DataType.STRING(100),
        allowNull: false,
      },
      price: {
        type: DataType.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      qty: {
        type: DataType.SMALLINT,
        allowNull: false,
      },
      sub_total: {
        type: DataType.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      created_at: DataType.DATE,
      updated_at: DataType.DATE,
      deleted_at: DataType.DATE,
    }, { transaction });

    await queryInterface.addIndex('member_transaction_items', ['transaction_id'], { where: { deleted_at: null }, transaction });
  });
};
export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.sequelize.transaction(async (transaction) => {
    await queryInterface.removeIndex('member_transaction_items', ['transaction_id'], { where: { deleted_at: null }, transaction });
    await queryInterface.dropTable('member_transaction_items', { transaction });
  });
};
