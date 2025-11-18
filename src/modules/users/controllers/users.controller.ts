import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import {
  CreateUserService,
  UpdateUserService,
  DeleteUserService,
} from '../services';
import { CreateUserDTO, UpdateUserDTO, UserResponseDTO } from '../dtos';
import { Public } from '@/common/decorators';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly createUserService: CreateUserService,
    private readonly updateUserService: UpdateUserService,
    private readonly deleteUserService: DeleteUserService,
  ) {}

  @Public()
  @Post()
  @ApiOperation({
    summary: 'Create a new user',
    description:
      'Creates a new user with hashed password and returns authentication tokens',
  })
  @ApiResponse({
    status: 201,
    description: 'User successfully created',
    type: UserResponseDTO,
  })
  @ApiResponse({
    status: 409,
    description: 'Email already registered',
  })
  async create(@Body() createUserDto: CreateUserDTO): Promise<UserResponseDTO> {
    return this.createUserService.execute(createUserDto);
  }

  @ApiBearerAuth()
  @Patch(':id')
  @ApiOperation({
    summary: 'Update user',
    description:
      'Updates user information. Password will be hashed if provided',
  })
  @ApiParam({
    name: 'id',
    description: 'User UUID',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'User successfully updated',
    type: UserResponseDTO,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @ApiResponse({
    status: 409,
    description: 'Email already registered',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDTO,
  ): Promise<UserResponseDTO> {
    return this.updateUserService.execute(id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete user',
    description: 'Permanently deletes a user from the system',
  })
  @ApiParam({
    name: 'id',
    description: 'User UUID',
    type: String,
  })
  @ApiResponse({
    status: 204,
    description: 'User successfully deleted',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.deleteUserService.execute(id);
  }
}
