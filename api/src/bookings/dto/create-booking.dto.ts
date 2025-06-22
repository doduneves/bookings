import {
  IsString,
  IsNotEmpty,
  IsPhoneNumber,
  IsDateString,
  IsOptional,
} from 'class-validator';

export class CreateBookingDto {
  @IsNotEmpty()
  hotelId: string;

  @IsNotEmpty()
  eventId: string;

  @IsString()
  @IsNotEmpty()
  guestName: string;

  @IsString()
  @IsNotEmpty()
  @IsPhoneNumber('US', { message: 'Must be a valid phone number' })
  guestPhoneNumber: string;

  @IsDateString()
  @IsNotEmpty()
  checkInDate: string;

  @IsDateString()
  @IsNotEmpty()
  checkOutDate: string;

  @IsOptional()
  roomingListId?: string;
}
