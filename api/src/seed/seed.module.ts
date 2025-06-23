import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedController } from './seed.controller';
import { SeedService } from './seed.service';
import { BookingEntity } from '../bookings/entities/booking.entity';
import { RoomingListEntity } from '../rooming-lists/entities/rooming-list.entity';
import { UserEntity } from '../users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([BookingEntity, RoomingListEntity, UserEntity]),
  ],
  controllers: [SeedController],
  providers: [SeedService],
})
export class SeedModule {}
