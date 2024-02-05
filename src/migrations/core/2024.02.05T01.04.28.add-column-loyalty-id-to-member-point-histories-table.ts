import { Migration } from '@config/database/migration.provider';
import { DataType } from 'sequelize-typescript';

export const databasePath = __dirname;

export const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.sequelize.transaction(async (transaction) => {
    await queryInterface.addColumn('member_point_histories', 'loyalty_id', {
      type: DataType.INTEGER,
      allowNull: true,
      references: {
        key: 'id',
        model: 'loyalties'
      },
    }, { transaction });
  });
};
export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.sequelize.transaction(async (transaction) => {
    // await queryInterface.dropTable('table_name');
  });
};
