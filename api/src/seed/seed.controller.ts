import { Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { SeedService } from './seed.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('seeds')
@Controller('seeds')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Post('run-all')
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
  async runSeed() {
    await this.seedService.seedDatabase();
    return { message: 'Database seeded successfully!' };
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
    await this.seedService.clearDatabase();
    return { message: 'Database cleared successfully!' };
  }
}
