import { ApiProperty } from '@nestjs/swagger';

export class PaginatedResponseDto<T> {
  @ApiProperty({
    isArray: true,
    description: 'Array of items for the current page',
  })
  items: T[];

  @ApiProperty({ description: 'Total number of items across all pages' })
  totalItems: number;

  @ApiProperty({ description: 'Number of items returned per page' })
  itemsPerPage: number;

  @ApiProperty({ description: 'Total number of pages available' })
  totalPages: number;

  @ApiProperty({ description: 'Current page number' })
  currentPage: number;
}
