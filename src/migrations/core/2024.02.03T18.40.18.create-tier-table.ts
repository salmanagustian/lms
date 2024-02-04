import { Migration } from '@config/database/migration.provider';
import { DataType } from 'sequelize-typescript';

export const databasePath = __dirname;

export const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.sequelize.transaction(async (transaction) => {
    await queryInterface.createTable('tiers', {
      id: {
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataType.STRING(100),
        allowNull: false,
      },
      min_point: {
        type: DataType.SMALLINT,
        allowNull: false,
        defaultValue: 0,
      },
      max_point: {
        type: DataType.SMALLINT,
        allowNull: false,
        defaultValue: 0,
      },
      created_at: DataType.DATE,
      updated_at: DataType.DATE,
      deleted_at: DataType.DATE,
    }, { transaction });
  });
};
export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.sequelize.transaction(async (transaction) => {
    await queryInterface.dropTable('tiers', { transaction });
  });
};
