import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

import { UserEntity } from 'src/users/entities/user.entity';
import { BookingEntity } from 'src/bookings/entities/booking.entity';
import { RoomingListEntity } from 'src/rooming-lists/entities/rooming-list.entity';

dotenv.config({ path: './.env' });

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [BookingEntity, RoomingListEntity, UserEntity],
  migrations: [__dirname + '/database/migrations/*.{ts,js}'],
  synchronize: false,
  logging: true,
});

export default AppDataSource;
