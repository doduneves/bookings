import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRoomingListDto } from './dto/create-rooming-list.dto';
import { UpdateRoomingListDto } from './dto/update-rooming-list.dto';
import { RoomingListEntity } from './entities/rooming-list.entity';
import { BookingEntity } from 'src/bookings/entities/booking.entity';

@Injectable()
export class RoomingListsService {
  constructor(
    @InjectRepository(RoomingListEntity)
    private roomingListsRepository: Repository<RoomingListEntity>,
    @InjectRepository(BookingEntity)
    private bookingsRepository: Repository<BookingEntity>,
  ) {}

  async create(
    createRoomingListDto: CreateRoomingListDto,
  ): Promise<RoomingListEntity> {
    const newRoomingList =
      this.roomingListsRepository.create(createRoomingListDto);
    return this.roomingListsRepository.save(newRoomingList);
  }

  async findAll(): Promise<RoomingListEntity[]> {
    return this.roomingListsRepository.find({
      relations: ['bookings'],
    });
  }

  async findOne(roomingListId: string): Promise<RoomingListEntity> {
    const roomingList = await this.roomingListsRepository.findOne({
      where: { roomingListId },
      relations: ['bookings'],
    });
    if (!roomingList) {
      throw new NotFoundException(
        `Rooming List with ID ${roomingListId} not found`,
      );
    }
    return roomingList;
  }

  async update(
    roomingListId: string,
    updateRoomingListDto: UpdateRoomingListDto,
  ): Promise<RoomingListEntity> {
    const roomingList = await this.roomingListsRepository.preload({
      roomingListId: roomingListId,
      ...updateRoomingListDto,
    });
    if (!roomingList) {
      throw new NotFoundException(
        `Rooming List with ID ${roomingListId} not found`,
      );
    }
    return this.roomingListsRepository.save(roomingList);
  }

  async remove(roomingListId: string): Promise<void> {
    const result = await this.roomingListsRepository.delete(roomingListId);
    if (result.affected === 0) {
      throw new NotFoundException(
        `Rooming List with ID ${roomingListId} not found`,
      );
    }
  }
}
