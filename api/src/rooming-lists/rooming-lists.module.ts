import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomingListsController } from './rooming-lists.controller';
import { RoomingListsService } from './rooming-lists.service';
import { BookingEntity } from 'src/bookings/entities/booking.entity';
import { RoomingListEntity } from './entities/rooming-list.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RoomingListEntity, BookingEntity])],
  controllers: [RoomingListsController],
  providers: [RoomingListsService],
})
export class RoomingListsModule {}
