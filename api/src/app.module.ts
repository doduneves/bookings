import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BookingsModule } from './bookings/bookings.module';
import { RoomingListsModule } from './rooming-lists/rooming-lists.module';
import { SeedModule } from './seed/seed.module';

import { BookingEntity } from './bookings/entities/booking.entity';
import { RoomingListEntity } from './rooming-lists/entities/rooming-list.entity';
import { UserEntity } from './users/entities/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: parseInt(configService.get<string>('DB_PORT') || '5432', 10),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [BookingEntity, RoomingListEntity, UserEntity],
        synchronize: false,
        migrationsRun: false,
        migrations: [__dirname + '/../database/migrations/*.{ts,js}'],
        cli: {
          migrationsDir: 'database/migrations',
        },
        logging: true,
      }),
    }),
    BookingsModule,
    RoomingListsModule,
    SeedModule, 
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
