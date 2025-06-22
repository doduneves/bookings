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
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';

@ApiTags('bookings')
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new booking' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The booking has been successfully created.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data.',
  })
  create(@Body() createBookingDto: CreateBookingDto) {
    return this.bookingsService.create(createBookingDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all bookings' })
  @ApiResponse({ status: HttpStatus.OK, description: 'List of all bookings.' })
  findAll() {
    return this.bookingsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a single booking by ID' })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the booking (ULID)',
  })
  @ApiResponse({ status: HttpStatus.OK, description: 'The booking details.' })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Booking not found.',
  })
  findOne(@Param('id') id: string) {
    return this.bookingsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing booking by ID' })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the booking (ULID)',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The booking has been successfully updated.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Booking not found.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data.',
  })
  update(@Param('id') id: string, @Body() updateBookingDto: UpdateBookingDto) {
    return this.bookingsService.update(id, updateBookingDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a booking by ID' })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the booking (ULID)',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'The booking has been successfully deleted.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Booking not found.',
  })
  remove(@Param('id') id: string) {
    return this.bookingsService.remove(id);
  }
}
