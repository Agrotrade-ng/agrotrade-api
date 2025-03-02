import { DataSource, DataSourceOptions } from 'typeorm';
import path from 'path';
import { User } from '../api/v1/models/user.model';
require('dotenv').config();

const isCompiled = path.extname(__filename).includes('.js');
const config = {
    type: process.env.DB_TYPE,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    logging: isCompiled ? false : true,
    synchronize: true,
    entities: [User],
} as DataSourceOptions;

export const AppDataSource = new DataSource(config);
