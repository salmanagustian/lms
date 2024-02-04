import { Migration } from '@config/database/migration.provider';
import { Member } from '@models/Member';
import { UserLogin } from '@models/UserLogin';
import { hash } from 'bcrypt';
import { DateTime } from 'luxon';
import { DataType } from 'sequelize-typescript';

export const databasePath = __dirname;

export const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.sequelize.transaction(async (transaction) => {
    const password = await hash('Password@123', 10);
    const userLogin = await UserLogin.create({
      email: 'salmanagustian@gmail.com',
      password
    }, { transaction });

    await Member.create({
      userId: userLogin.id,
      name: 'M Salman Agustian',
      phoneNumber: '082122979820',
      joinDate: DateTime.fromFormat('2024-02-05', 'yyyy-MM-dd').toJSDate(),
      birthDate: DateTime.fromFormat('1996-08-17', 'yyyy-MM-dd').toJSDate(),
    }, { transaction });

    const userLogin2 = await UserLogin.create({
      email: 'febrian@gmail.com',
      password
    }, { transaction });

    await Member.create({
      userId: userLogin2.id,
      name: 'Febrian Pranata',
      phoneNumber: '082122890820',
      joinDate: DateTime.fromFormat('2024-02-05', 'yyyy-MM-dd').toJSDate(),
      birthDate: DateTime.fromFormat('1996-04-12', 'yyyy-MM-dd').toJSDate(),
    }, { transaction });

  });
};
export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.sequelize.transaction(async (transaction) => {
    await queryInterface.dropTable('table_name');
  });
};
