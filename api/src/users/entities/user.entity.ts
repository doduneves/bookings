import { Entity, PrimaryColumn, Column, BeforeInsert } from 'typeorm';
import { ulid } from 'ulid';

@Entity('users')
export class UserEntity {
  @PrimaryColumn({ type: 'varchar' })
  userId: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  email: string;

  @Column({ default: 'user' })
  role: string;

  @BeforeInsert()
  generateId() {
    this.userId = `usr_${ulid()}`;
  }
}
