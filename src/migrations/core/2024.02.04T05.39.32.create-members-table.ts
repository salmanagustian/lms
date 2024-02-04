import { Migration } from '@config/database/migration.provider';
import { DataType } from 'sequelize-typescript';

export const databasePath = __dirname;

export const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.sequelize.transaction(async (transaction) => {
    await queryInterface.createTable('members', {
      id: {
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataType.INTEGER,
        allowNull: false,
        references: {
          key: 'id',
          model: 'user_login',
        },
      },
      name: {
        type: DataType.STRING(50),
        allowNull: false,
      },
      phone_number: {
        type: DataType.STRING(13),
        allowNull: false,
        unique: true,
      },
      birth_date: {
        type: DataType.DATEONLY,
        allowNull: false,
      },
      join_date: {
        type: DataType.DATEONLY,
        allowNull: false,
      },
      address: {
        type: DataType.TEXT,
        allowNull: true,
      },
      earned_point: {
        type: DataType.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      remained_point: {
        type: DataType.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      redeemed_point: {
        type: DataType.INTEGER,
        allowNull: false,
        defaultValue: 0,
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

    await queryInterface.addIndex('members', ['is_active'], { where: { deleted_at: null }, transaction });
  });
};
export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.sequelize.transaction(async (transaction) => {
    await queryInterface.removeIndex('members', ['is_active'], { where: { deleted_at: null }, transaction });
    await queryInterface.dropTable('members', { transaction });
  });
};
