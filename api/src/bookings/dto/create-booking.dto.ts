import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsPhoneNumber,
  IsDateString,
  IsOptional,
  IsUUID,
} from 'class-validator';

export class CreateBookingDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  hotelId: string;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  eventId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  guestName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  // @IsPhoneNumber('US', { message: 'Must be a valid US phone number' })
  @IsPhoneNumber('BR', { message: 'Must be a valid BR phone number' })
  guestPhoneNumber: string;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  checkInDate: string;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  checkOutDate: string;

  @ApiProperty()
  @IsOptional()
  roomingListId?: string;
}
