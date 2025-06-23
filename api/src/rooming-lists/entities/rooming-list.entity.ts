import {
  Entity,
  Column,
  ManyToMany,
  PrimaryColumn,
  BeforeInsert,
} from 'typeorm';
import { BookingEntity } from 'src/bookings/entities/booking.entity';
import { ulid } from 'ulid';

@Entity('roominglists')
export class RoomingListEntity {
  @PrimaryColumn({ type: 'varchar' })
  roomingListId: string;

  @Column('int')
  eventId: number;

  @Column('int')
  hotelId: number;

  @Column()
  rfpName: string;

  @Column('date')
  cutOffDate: Date;

  @Column({ default: 'active' })
  status: string;

  @Column()
  agreement_type: string;

  @Column({
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @ManyToMany(() => BookingEntity, (booking) => booking.roomingLists)
  bookings: BookingEntity[];

}
