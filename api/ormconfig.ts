import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { User } from 'src/users/entities/user.entity';

dotenv.config({ path: './.env' }); // Load variables from api/.env

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [User],
  migrations: [__dirname + '/database/migrations/*.{ts,js}'],
  synchronize: false,
  logging: true,
});

export default AppDataSource;
