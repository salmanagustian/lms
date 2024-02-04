import { Migration } from '@config/database/migration.provider';
import { DataType } from 'sequelize-typescript';

export const databasePath = __dirname;

export const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.sequelize.transaction(async (transaction) => {
   await queryInterface.sequelize.query(`
    CREATE OR REPLACE FUNCTION public.format_transaction_id_fn(earnedpointcode character varying)
    RETURNS character varying
    LANGUAGE plpgsql
      AS $function$
          declare
            current_seq int;
            current_ts timestamp;
            format_dt varchar;
            day_tmp varchar;
            month_tmp varchar;
            year_tmp varchar;
            earnedTrsCode varchar;
          begin 
            current_ts := now()::timestamp;
            day_tmp := date_part('day', current_ts); 

            if day_tmp::int <= 9 then
              day_tmp := '0' || day_tmp;
            end if;
            
            month_tmp := date_part('month', current_ts);
            year_tmp := date_part('year', current_ts);
            format_dt := day_tmp || month_tmp || year_tmp ;
          
              INSERT INTO transaction_id_sequences (code, date) 
            VALUES(earnedPointCode, format_dt)
            ON CONFLICT 
              (code, date)
              DO UPDATE SET 
                "current" = transaction_id_sequences."current" + 1 
                  WHERE transaction_id_sequences.code = earnedPointCode AND transaction_id_sequences.date = format_dt
                    returning transaction_id_sequences."current" into current_seq; 
                  
          earnedTrsCode := earnedPointCode || '/' || lpad(current_seq::varchar,5,'0') || '/' || format_dt;
          
          return earnedTrsCode;
            end;
          $function$;`, { transaction });
  });
};
export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.sequelize.transaction(async (transaction) => {
    await queryInterface.sequelize.query('drop function format_transaction_id_fn(varchar)', { transaction });
  });
};
