import { RoomingListEntity } from 'src/rooming-lists/entities/rooming-list.entity';
import { Entity, Column, JoinTable, ManyToMany, PrimaryColumn, BeforeInsert } from 'typeorm';
import { ulid } from 'ulid';

@Entity('bookings')
export class BookingEntity {
  @PrimaryColumn('varchar')
  bookingId: string;

  @Column()
  hotelId: string;

  @Column()
  eventId: string;

  @Column()
  guestName: string;

  @Column()
  guestPhoneNumber: string;

  @Column('date')
  checkInDate: Date;

  @Column('date')
  checkOutDate: Date;

  @Column({
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @ManyToMany(() => RoomingListEntity, (roomingList) => roomingList.bookings)
  @JoinTable({
    name: 'rooming_list_bookings',
    joinColumn: {
      name: 'booking_id',
      referencedColumnName: 'bookingId',
    },
    inverseJoinColumn: {
      name: 'rooming_list_id',
      referencedColumnName: 'roomingListId',
    },
  })
  roomingLists: RoomingListEntity[];

  @BeforeInsert()
  generateId() {
    this.bookingId = `bkn_${ulid()}`;
  }
}
