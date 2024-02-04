import { Migration } from '@config/database/migration.provider';
import { EEarnedPoint } from '@utils/enum';
import { DataType } from 'sequelize-typescript';

export const databasePath = __dirname;

export const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.sequelize.transaction(async (transaction) => {
    await queryInterface.createTable('loyalty_policies', {
      id: {
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      loyalty_id: {
        type:DataType.INTEGER,
        allowNull: false,
        references: {
          key: 'id',
          model: 'loyalties',
        },
      },
      category: {
        type: DataType.ENUM(EEarnedPoint.TRANSACTIONAL, EEarnedPoint.COMMUNITY),
        allowNull: false,
      },
      config: {
        type: DataType.JSONB,
        allowNull: false
      },
      created_at: DataType.DATE,
      updated_at: DataType.DATE,
      deleted_at: DataType.DATE,
    }, {transaction });

    await queryInterface.addIndex('loyalty_policies', ['loyalty_id'], { where: { deleted_at: null }, transaction });
  });
};
export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.sequelize.transaction(async (transaction) => {
    await queryInterface.removeIndex('loyalty_policies', ['loyalty_id'], { where: { deleted_at: null }, transaction });
    await queryInterface.dropTable('loyalty_policies', {transaction });
  });
};
