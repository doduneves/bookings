import { Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { SeedService } from './seed.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('seeds')
@Controller('seeds')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}


  @Post('run-users')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Populate the database with initial users set on env',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Database seeding completed successfully.',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Failed to seed the database.',
  })
  async runUsersSeed() {
    await this.seedService.seedUser();
    return { message: 'Users seeded successfully!' };
  }


  @Post('run-bookings')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Populate the database with initial data from JSON files',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Database seeding completed successfully.',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Failed to seed the database.',
  })
  async runBookingsSeed() {
    await this.seedService.seedRoomingListAndBooking();
    return { message: 'Rooming and Booking seeded successfully!' };
  }

  @Post('clear')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary:
      'Clear all data from database tables',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Database cleared successfully.',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Failed to clear the database.',
  })
  async clearDatabase() {
    await this.seedService.clearRoomingListAndBooking();
    return { message: 'Database cleared successfully!' };
  }
}
