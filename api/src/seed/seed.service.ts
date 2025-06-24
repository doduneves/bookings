import {
  Injectable,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { join } from 'path';
import { readFileSync } from 'fs';
import { BookingEntity } from '../bookings/entities/booking.entity';
import { RoomingListEntity } from '../rooming-lists/entities/rooming-list.entity';
import { UserEntity } from '../users/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  private readonly seedUsername: string;
  private readonly seedPassword: string;
  private readonly seedEmail: string;

  private readonly defaultUserRole = 'user';

  constructor(
    @InjectRepository(BookingEntity)
    private bookingRepository: Repository<BookingEntity>,
    @InjectRepository(RoomingListEntity)
    private roomingListRepository: Repository<RoomingListEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private configService: ConfigService,
  ) {
    this.seedUsername = this.getRequiredEnv('SEED_USERNAME');
    this.seedPassword = this.getRequiredEnv('SEED_USERPASSWORD');
    this.seedEmail = this.getRequiredEnv('SEED_USEREMAIL');
  }

  private getRequiredEnv(key: string): string {
    const value = this.configService.get<string>(key);
    if (!value) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
    return value;
  }

  async seedUser() {
    try {
      await this.clearUsers();

      const hashedPassword = await bcrypt.hash(this.seedPassword, 10);

      this.logger.log('Starting user seeding...');
      const defaultUser = this.userRepository.create({
        username: this.seedUsername,
        password: hashedPassword,
        email: this.seedEmail,
        role: this.defaultUserRole,
      });

      await this.userRepository.save(defaultUser);
      this.logger.log(`Seeded default user: ${this.seedUsername}`);
    } catch (error) {
      this.logger.error('Users seseding failed:', error.message, error.stack);
      throw new InternalServerErrorException('Failed to seed the database.');
    }
  }

  async seedRoomingListAndBooking() {
    this.logger.log('Starting rooming and bookings seeding...');
    try {
      await this.clearRoomingListAndBooking();

      const roomingListsData = this.readJsonFile('rooming-lists.json');
      if (roomingListsData && roomingListsData.length > 0) {
        const roomingLists = this.roomingListRepository.create(
          roomingListsData.map((rl) => ({
            ...rl,
            cutOffDate: new Date(rl.cutOffDate),
          })),
        );
        await this.roomingListRepository.save(roomingLists);
        this.logger.log(`Seeded ${roomingLists.length} rooming lists.`);
      }

      const bookingsData = this.readJsonFile('bookings.json');
      let savedBookings: BookingEntity[] = [];
      if (bookingsData && bookingsData.length > 0) {
        const bookings = this.bookingRepository.create(
          bookingsData.map((b) => ({
            ...b,
            checkInDate: new Date(b.checkInDate),
            checkOutDate: new Date(b.checkOutDate),
          })),
        );
        savedBookings = await this.bookingRepository.save(bookings);
        this.logger.log(`Seeded ${savedBookings.length} bookings.`);
      }

      const roomingListBookingsData = this.readJsonFile(
        'rooming-list-bookings.json',
      );
      if (roomingListBookingsData && roomingListBookingsData.length > 0) {
        this.logger.log(
          'Establishing Rooming List to Booking relationships...',
        );
        for (const link of roomingListBookingsData) {
          const booking = await this.bookingRepository.findOne({
            where: { bookingId: link.bookingId },
            relations: ['roomingLists'],
          });
          const roomingList = await this.roomingListRepository.findOne({
            where: { roomingListId: link.roomingListId },
          });

          if (booking && roomingList) {
            if (
              !booking.roomingLists.some(
                (rl) => rl.roomingListId === roomingList.roomingListId,
              )
            ) {
              booking.roomingLists.push(roomingList);
              await this.bookingRepository.save(booking);
              this.logger.debug(
                `Linked booking ${link.bookingId} to rooming list ${link.roomingListId}`,
              );
            }
          } else {
            this.logger.warn(
              `Could not find booking ${link.bookingId} or rooming list ${link.roomingListId} for linking.`,
            );
          }
        }
        this.logger.log(
          `Established ${roomingListBookingsData.length} Rooming List to Booking relationships.`,
        );
      }

      this.logger.log('Rooming List and Booking seeding completed.');
    } catch (error) {
      this.logger.error(
        'Rooming List and Booking seeding failed:',
        error.message,
        error.stack,
      );
      throw new InternalServerErrorException('Failed to seed the database.');
    }
  }

  async clearUsers() {
    this.logger.log('Clearing existing users data...');
    try {
      const users = await this.userRepository.find();
      await this.userRepository.remove(users);
      this.logger.log('Cleared users tables.');
    } catch (error) {
      this.logger.error(
        'Database clearing failed:',
        error.message,
        error.stack,
      );
      throw new InternalServerErrorException('Failed to clear database data.');
    }
  }

  async clearRoomingListAndBooking() {
    this.logger.log('Clearing existing database data...');
    try {
      await this.bookingRepository.query('DELETE FROM rooming_list_bookings;');
      this.logger.log('Cleared rooming_list_bookings join table.');

      const bookings = await this.bookingRepository.find();
      await this.bookingRepository.remove(bookings);
      this.logger.log('Cleared bookings tables.');

      const roomingLists = await this.roomingListRepository.find();
      await this.roomingListRepository.remove(roomingLists);
      this.logger.log('Cleared room_lists tables.');
    } catch (error) {
      this.logger.error(
        'Database clearing failed:',
        error.message,
        error.stack,
      );
      throw new InternalServerErrorException('Failed to clear database data.');
    }
  }

  private readJsonFile(filename: string): any[] {
    const filePath = join(process.cwd(), 'data', filename);
    try {
      const fileContent = readFileSync(filePath, 'utf8');
      return JSON.parse(fileContent);
    } catch (error) {
      this.logger.warn(`Could not read or parse ${filename}: ${error.message}`);
      return [];
    }
  }
}
