import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BookingEntity } from './entities/booking.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(BookingEntity)
    private bookingsRepository: Repository<BookingEntity>,
  ) {}

  async create(createBookingDto: CreateBookingDto): Promise<BookingEntity> {
    const newBooking = this.bookingsRepository.create(createBookingDto);
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
    return this.bookingsRepository.save(booking);
  }

  async remove(bookingId: string): Promise<void> {
    const result = await this.bookingsRepository.delete(bookingId);
    if (result.affected === 0) {
      throw new NotFoundException(`Booking with ID ${bookingId} not found`);
    }
  }
}
