import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRoomingListDto } from './dto/create-rooming-list.dto';
import { UpdateRoomingListDto } from './dto/update-rooming-list.dto';
import { RoomingListEntity } from './entities/rooming-list.entity';
import { BookingEntity } from 'src/bookings/entities/booking.entity';
import { PaginatedResponseDto } from 'src/common/dto/paginated-response.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { paginate } from 'src/common/utils/pagination';

interface RoomingListsByEvent {
  eventId: number;
  roomingLists: RoomingListEntity[];
}

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

  async findAll(
    query: PaginationQueryDto,
  ): Promise<PaginatedResponseDto<RoomingListEntity>> {
    const { eventId, status, search } = query;
    
    const qb = this.roomingListsRepository
      .createQueryBuilder('entity')
      .leftJoinAndSelect('entity.bookings', 'bookings');

    if (eventId) {
      qb.andWhere('entity.eventId = :eventId', { eventId });
    }

    if (status) {
      qb.andWhere('entity.status ILIKE :status', { status });
    }

    if (search) {
      qb.andWhere(
        `(entity.rfpName ILIKE :search OR entity.hotelId ILIKE :search)`,
        { search: `%${search}%` },
      );
    }

    return paginate(qb, query);
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

  async findRoomingListsGroupedByEventId(): Promise<RoomingListsByEvent[]> {
    const allRoomingLists = await this.roomingListsRepository.find({
      relations: ['bookings'],
      order: {
        eventId: 'ASC',
        createdAt: 'ASC',
      },
    });

    const groupedData = new Map<number, RoomingListEntity[]>();

    allRoomingLists.forEach((roomingList) => {
      if (!groupedData.has(roomingList.eventId)) {
        groupedData.set(roomingList.eventId, []);
      }
      groupedData.get(roomingList.eventId)?.push(roomingList);
    });

    const result: RoomingListsByEvent[] = Array.from(groupedData.entries()).map(
      ([eventId, roomingLists]) => ({
        eventId: eventId,
        roomingLists: roomingLists,
      }),
    );

    return result;
  }
}
