import { registerAs } from '@nestjs/config';
import { join } from 'path';

export default registerAs('database', () => ({
  connection: process.env.DB_CONNECTION,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  name: process.env.DB_NAME,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  readHost: process.env.DB_READ_HOST,
  readPort: process.env.DB_READ_PORT,
  readName: process.env.DB_READ_NAME,
  readUsername: process.env.DB_READ_USERNAME,
  readPassword: process.env.DB_READ_PASSWORD,
}));

export function configMapping(dbConfig) {
  return {
    dialect: dbConfig.connection,
    logging: true,
    logQueryParameters: false,
    define: {
      underscored: true,
    },
    replication: {
      read: [
        {
          database: dbConfig.readName,
          username: dbConfig.readUsername,
          password: dbConfig.readPassword,
          host: dbConfig.readHost,
          port: +dbConfig.readPort,
        },
      ],
      write: {
        database: dbConfig.name,
        username: dbConfig.username,
        password: dbConfig.password,
        host: dbConfig.host,
        port: +dbConfig.port,
      },
    },
    pool: {
      min: 0,
      max: 30,
    },
    dialectOptions: {
      // decimalNumbers: true,
      // timezone: '+07:00',
    },
    // timezone: '+07:00',
    keepDefaultTimezone: true,
    models: [join(__dirname, '../../models')],
    synchronize: false,
  };
}
