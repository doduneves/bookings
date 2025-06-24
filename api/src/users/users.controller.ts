import { Controller, Get, HttpStatus, Query } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { PaginatedResponseDto } from "src/common/dto/paginated-response.dto";
import { PaginationQueryDto } from "src/common/dto/pagination-query.dto";
import { RoomingListEntity } from "src/rooming-lists/entities/rooming-list.entity";
import { UsersService } from "./users.service";
import { UserEntity } from "./entities/user.entity";
import { Auth } from "src/auth/decorators/auth.decorator";

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Auth()
  @Get()
  @ApiOperation({ summary: 'Retrieve all users' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of all users.',
  })
  async findAll(
  ): Promise<Partial<UserEntity>[]> {
    return this.usersService.findAll();
  }
}
