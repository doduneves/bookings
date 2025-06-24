import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';

import { RoomingListsService } from './rooming-lists.service';
import { CreateRoomingListDto } from './dto/create-rooming-list.dto';
import { UpdateRoomingListDto } from './dto/update-rooming-list.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { RoomingListEntity } from './entities/rooming-list.entity';
import { PaginatedResponseDto } from 'src/common/dto/paginated-response.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';

@ApiTags('rooming-lists')
@Controller('rooming-lists')
export class RoomingListsController {
  constructor(private readonly roomingListsService: RoomingListsService) {}

  @Auth()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new rooming list' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The rooming list has been successfully created.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data.',
  })
  create(@Body() createRoomingListDto: CreateRoomingListDto) {
    return this.roomingListsService.create(createRoomingListDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all rooming lists' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of all rooming lists.',
  })
  async findAll(
    @Query() query: PaginationQueryDto,
  ): Promise<PaginatedResponseDto<RoomingListEntity>> {
    return this.roomingListsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a single rooming list by ID' })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the rooming list (ULID)',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The rooming list details.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Rooming list not found.',
  })
  findOne(@Param('id') id: string) {
    return this.roomingListsService.findOne(id);
  }

  @Auth()
  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing rooming list by ID' })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the rooming list (ULID)',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The rooming list has been successfully updated.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Rooming list not found.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data.',
  })
  update(
    @Param('id') id: string,
    @Body() updateRoomingListDto: UpdateRoomingListDto,
  ) {
    return this.roomingListsService.update(id, updateRoomingListDto);
  }

  @Auth()
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a rooming list by ID' })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the rooming list (ULID)',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'The rooming list has been successfully deleted.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Rooming list not found.',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.roomingListsService.remove(id);
  }
}
