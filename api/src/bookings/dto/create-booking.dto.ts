import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsPhoneNumber,
  IsDateString,
  IsOptional,
  IsUUID,
  IsNumber,
} from 'class-validator';

export class CreateBookingDto {
  @ApiProperty({
    description: 'The unique identifier of the hotel (from external system)',
    example: 101,
    type: 'number',
  })
  @IsNumber()
  @IsNotEmpty()
  hotelId: number;

  @ApiProperty({
    description: 'The unique identifier of the event associated with the booking (from external system)',
    example: 1,
    type: 'number',
  })
  @IsNumber()
  @IsNotEmpty()
  eventId: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  guestName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
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
