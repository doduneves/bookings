import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BookingEntity } from './entities/booking.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { RoomingListsService } from 'src/rooming-lists/rooming-lists.service';
import { RoomingListEntity } from 'src/rooming-lists/entities/rooming-list.entity';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(BookingEntity)
    private bookingsRepository: Repository<BookingEntity>,
    private roomingListsService: RoomingListsService,
  ) {}

  async create(createBookingDto: CreateBookingDto): Promise<BookingEntity> {
    const newBooking = this.bookingsRepository.create(createBookingDto);

    if (createBookingDto.roomingListId) {
      const roomingList = await this.roomingListsService.findOne(
        createBookingDto.roomingListId,
      );
      if (!roomingList) {
        throw new NotFoundException(
          `Rooming List with ID ${createBookingDto.roomingListId} not found.`,
        );
      }

      this.validateBookingRoomingListConsistency(createBookingDto.hotelId, createBookingDto.eventId, roomingList);

      newBooking.roomingLists = [roomingList];
    }

    const savedBooking = await this.bookingsRepository.save(newBooking);
    return savedBooking;
  }

  async findAll(): Promise<BookingEntity[]> {
    return this.bookingsRepository.find({ relations: ['roomingLists'] });
  }

  async findOne(bookingId: string): Promise<BookingEntity> {
    const booking = await this.bookingsRepository.findOne({
      where: { bookingId },
      relations: ['roomingLists'],
    });
    if (!booking) {
      throw new NotFoundException(`Booking with ID ${bookingId} not found`);
    }
    return booking;
  }

  async update(
    bookingId: string,
    updateBookingDto: UpdateBookingDto,
  ): Promise<BookingEntity> {
    const booking = await this.bookingsRepository.preload({
      bookingId: bookingId,
      ...updateBookingDto,
    });
    if (!booking) {
      throw new NotFoundException(`Booking with ID ${bookingId} not found`);
    }

    let targetRoomingList: RoomingListEntity | undefined;
    if (updateBookingDto.roomingListId) {
      targetRoomingList = await this.roomingListsService.findOne(updateBookingDto.roomingListId);
      if (!targetRoomingList) {
        throw new NotFoundException(`Rooming List with ID ${updateBookingDto.roomingListId} not found.`);
      }
    } else if (booking.roomingLists && booking.roomingLists.length > 0) {
      targetRoomingList = booking.roomingLists[0];
    }

    const currentHotelId = updateBookingDto.hotelId ?? booking.hotelId;
    const currentEventId = updateBookingDto.eventId ?? booking.eventId;

    if (targetRoomingList) {
      this.validateBookingRoomingListConsistency(currentHotelId, currentEventId, targetRoomingList);
    }

    return this.bookingsRepository.save(booking);
  }

  async remove(bookingId: string): Promise<void> {
    const result = await this.bookingsRepository.delete(bookingId);
    if (result.affected === 0) {
      throw new NotFoundException(`Booking with ID ${bookingId} not found`);
    }
  }

  private validateBookingRoomingListConsistency(
    bookingHotelId: number,
    bookingEventId: number,
    roomingList: RoomingListEntity,
  ): void {
    if (
      roomingList.hotelId !== bookingHotelId ||
      roomingList.eventId !== bookingEventId
    ) {
      throw new BadRequestException(
        `Booking's hotelId or eventId does not match associated rooming list).`,
      );
    }
  }
}
