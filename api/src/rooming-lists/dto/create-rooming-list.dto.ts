import { ApiProperty } from '@nestjs/swagger';
import {
  IsUUID,
  IsString,
  IsNotEmpty,
  IsDateString,
  IsIn,
} from 'class-validator';

export class CreateRoomingListDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  eventId: string;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  hotelId: string;

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
