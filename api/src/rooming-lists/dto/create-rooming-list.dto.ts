import {
  IsUUID,
  IsString,
  IsNotEmpty,
  IsDateString,
  IsIn,
} from 'class-validator';

export class CreateRoomingListDto {
  @IsUUID()
  @IsNotEmpty()
  eventId: string;

  @IsUUID()
  @IsNotEmpty()
  hotelId: string;

  @IsString()
  @IsNotEmpty()
  rfpName: string;

  @IsDateString()
  @IsNotEmpty()
  cutOffDate: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['Active', 'Closed', 'Cancelled'], {
    message: 'Status must be Active, Closed, or Cancelled',
  })
  status: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['leisure', 'staff', 'artist'], {
    message: 'Agreement type must be leisure, staff, or artist',
  })
  agreement_type: string;
}
