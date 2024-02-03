import { Migration } from '@config/database/migration.provider';
import { DataType } from 'sequelize-typescript';

export const databasePath = __dirname;

export const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.sequelize.transaction(async (transaction) => {
    await queryInterface.createTable('user_login', {
      id: {
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      email: {
        type: DataType.STRING(50),
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataType.STRING,
        allowNull: false,
      },
      remember_me: {
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      created_at: DataType.DATE,
      updated_at: DataType.DATE,
      deleted_at: DataType.DATE,
    }, { transaction });
  });
};
export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.sequelize.transaction(async (transaction) => {
    await queryInterface.dropTable('user_login', { transaction });
  });
};
