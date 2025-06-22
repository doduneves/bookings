import { PartialType } from '@nestjs/mapped-types';
import { CreateRoomingListDto } from './create-rooming-list.dto';

export class UpdateRoomingListDto extends PartialType(CreateRoomingListDto) {}
