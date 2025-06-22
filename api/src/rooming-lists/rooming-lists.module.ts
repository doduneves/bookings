import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomingListsController } from './rooming-lists.controller';
import { RoomingListsService } from './rooming-lists.service';
import { BookingEntity } from 'src/bookings/entities/booking.entity';
import { RoomingListEntity } from './entities/rooming-list.entity';
import { BookingsModule } from 'src/bookings/bookings.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RoomingListEntity, BookingEntity]),
    forwardRef(() => BookingsModule),
  ],
  controllers: [RoomingListsController],
  providers: [RoomingListsService],
  exports: [RoomingListsService, TypeOrmModule.forFeature([RoomingListEntity])],
})
export class RoomingListsModule {}
