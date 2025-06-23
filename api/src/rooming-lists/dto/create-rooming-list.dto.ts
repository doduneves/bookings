import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsIn,
  IsNumber,
} from 'class-validator';

export class CreateRoomingListDto {
  @ApiProperty({
    description: 'The unique identifier of the event (from external system)',
    example: 1,
    type: 'number',
  })
  @IsNumber()
  @IsNotEmpty()
  eventId: number;

  @ApiProperty({
    description: 'The unique identifier of the hotel (from external system)',
    example: 101,
    type: 'number',
  })
  @IsNumber()
  @IsNotEmpty()
  hotelId: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  rfpName: string;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  cutOffDate: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsIn(['active', 'closed', 'cancelled'], {
    message: 'Status must be active, closed, or cancelled',
  })
  status: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsIn(['leisure', 'staff', 'artist'], {
    message: 'Agreement type must be leisure, staff, or artist',
  })
  agreement_type: string;
}
