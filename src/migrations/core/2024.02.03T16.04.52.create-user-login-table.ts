import { Migration } from '@config/database/migration.provider';
import { UserLogin } from '@models/UserLogin';
import { hash } from 'bcrypt';
import { DataType } from 'sequelize-typescript';

export const databasePath = __dirname;
const PASSWORD_SALT_ROUND = 10;

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
      is_active: {
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      created_at: DataType.DATE,
      updated_at: DataType.DATE,
      deleted_at: DataType.DATE,
    }, { transaction });

    const password = await hash('password', PASSWORD_SALT_ROUND);
    await UserLogin.create({
      email: 'salmanagustian@gmail.com',
      password
    }, { transaction });
  });
};
export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.sequelize.transaction(async (transaction) => {
    await queryInterface.dropTable('user_login', { transaction });
  });
};
