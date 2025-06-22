import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { BookingEntity } from './entities/booking.entity';
import { RoomingListsModule } from 'src/rooming-lists/rooming-lists.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([BookingEntity]),
    forwardRef(() => RoomingListsModule),
  ],
  controllers: [BookingsController],
  providers: [BookingsService],
})
export class BookingsModule {}
