import { FindManyOptions, Repository, SelectQueryBuilder } from 'typeorm';
import { PaginatedResponseDto } from '../dto/paginated-response.dto';
import { PaginationQueryDto } from '../dto/pagination-query.dto';

export async function paginate<T>(
  queryBuilder: SelectQueryBuilder<T>,
  paginationDto: PaginationQueryDto,
): Promise<PaginatedResponseDto<T>> {
  const {
    page = 1,
    limit = 10,
    sortBy = 'createdAt',
    sortOrder = 'ASC',
  } = paginationDto;

  const skip = (page - 1) * limit;

  if (sortBy) {
    queryBuilder.orderBy(
      `entity.${sortBy}`,
      sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC',
    );
  }

  queryBuilder.skip(skip).take(limit);

  const [items, totalItems] = await queryBuilder.getManyAndCount();

  const totalPages = Math.ceil(totalItems / limit);

  return {
    items,
    totalItems,
    itemsPerPage: limit,
    totalPages,
    currentPage: page,
  };
}
