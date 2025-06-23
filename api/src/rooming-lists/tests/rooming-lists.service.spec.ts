import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BookingEntity } from 'src/bookings/entities/booking.entity';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { RoomingListEntity } from '../entities/rooming-list.entity';
import { RoomingListsService } from '../rooming-lists.service';

describe('RoomingListsService', () => {
  let service: RoomingListsService;
  let roomingListRepo: Repository<RoomingListEntity>;
  let qb: SelectQueryBuilder<RoomingListEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoomingListsService,
        {
          provide: getRepositoryToken(RoomingListEntity),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            preload: jest.fn(),
            delete: jest.fn(),
            find: jest.fn(),
            createQueryBuilder: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(BookingEntity),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<RoomingListsService>(RoomingListsService);
    roomingListRepo = module.get<Repository<RoomingListEntity>>(
      getRepositoryToken(RoomingListEntity),
    );

    qb = {
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getManyAndCount: jest
        .fn()
        .mockResolvedValue([[{ roomingListId: '1' }], 1]),
    } as any;

    jest.spyOn(roomingListRepo, 'createQueryBuilder').mockReturnValue(qb);
  });

  describe('findAll', () => {
    it('should return paginated rooming lists', async () => {
      const query: PaginationQueryDto = {
        page: 1,
        limit: 10,
        sortBy: 'createdAt',
        sortOrder: 'DESC',
      };

      const result = await service.findAll(query);

      expect(result).toEqual({
        items: [{ roomingListId: '1' }],
        totalItems: 1,
        itemsPerPage: 10,
        totalPages: 1,
        currentPage: 1,
      });

      expect(qb.leftJoinAndSelect).toHaveBeenCalledWith(
        'entity.bookings',
        'bookings',
      );
      expect(qb.take).toHaveBeenCalledWith(10);
      expect(qb.skip).toHaveBeenCalledWith(0);
    });

    it('should apply eventId and status filters', async () => {
      const query: PaginationQueryDto = {
        eventId: '1',
        status: 'active',
      };

      await service.findAll(query);

      expect(qb.andWhere).toHaveBeenCalledWith('entity.eventId = :eventId', {
        eventId: '1',
      });
      expect(qb.andWhere).toHaveBeenCalledWith('entity.status ILIKE :status', {
        status: 'active',
      });
    });

    it('should apply search filter', async () => {
      const query: PaginationQueryDto = {
        search: 'Hilton',
      };

      await service.findAll(query);

      expect(qb.andWhere).toHaveBeenCalledWith(
        `(entity.rfpName ILIKE :search OR entity.hotelId ILIKE :search)`,
        { search: '%Hilton%' },
      );
    });
  });

  describe('create', () => {
    it('should create and return a new RoomingList', async () => {
      const dto = { rfpName: 'Test RFP' } as any;
      const created = { roomingListId: '1', ...dto };

      jest.spyOn(roomingListRepo, 'create').mockReturnValue(created);
      jest.spyOn(roomingListRepo, 'save').mockResolvedValue(created);

      const result = await service.create(dto);

      expect(result).toEqual(created);
      expect(roomingListRepo.create).toHaveBeenCalledWith(dto);
      expect(roomingListRepo.save).toHaveBeenCalledWith(created);
    });
  });

  describe('findOne', () => {
    it('should return a rooming list by ID', async () => {
      const found = { roomingListId: '1' } as RoomingListEntity;

      jest.spyOn(roomingListRepo, 'findOne').mockResolvedValue(found);

      const result = await service.findOne('1');
      expect(result).toEqual(found);
    });

    it('should throw if not found', async () => {
      jest.spyOn(roomingListRepo, 'findOne').mockResolvedValue(null);

      await expect(service.findOne('1')).rejects.toThrow(
        'Rooming List with ID 1 not found',
      );
    });
  });

  describe('update', () => {
    it('should update and return the entity', async () => {
      const updated = {
        roomingListId: '1',
        rfpName: 'Updated',
      } as RoomingListEntity;

      jest.spyOn(roomingListRepo, 'preload').mockResolvedValue(updated);
      jest.spyOn(roomingListRepo, 'save').mockResolvedValue(updated);

      const result = await service.update('1', { rfpName: 'Updated' });
      expect(result).toEqual(updated);
    });

    it('should throw if entity not found', async () => {
      jest.spyOn(roomingListRepo, 'preload').mockResolvedValue(null);

      await expect(service.update('1', {})).rejects.toThrow();
    });
  });

  describe('remove', () => {
    it('should remove a rooming list', async () => {
      jest
        .spyOn(roomingListRepo, 'delete')
        .mockResolvedValue({ affected: 1 } as any);

      await expect(service.remove('abc123')).resolves.toBeUndefined();
    });

    it('should throw if not found', async () => {
      jest
        .spyOn(roomingListRepo, 'delete')
        .mockResolvedValue({ affected: 0 } as any);

      await expect(service.remove('abc123')).rejects.toThrow();
    });
  });
});
