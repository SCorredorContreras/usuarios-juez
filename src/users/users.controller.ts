import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import {
  CreateUserDto,
  UpdateUserDto,
  LoginUserDto,
  ChangePasswordDto,
} from './dto/create-user.dto/create-user.dto';

@ApiBearerAuth()
@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - invalid input data',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict - username or email already exists',
  })
  @ApiBody({ type: CreateUserDto })
  async register(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.createUser(createUserDto);
    const { password, ...result } = user;
    return result;
  }

  @Post('login')
  @ApiOperation({ summary: 'Authenticate user and get access token' })
  @ApiResponse({
    status: 200,
    description: 'Login successful - returns user and access token',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - invalid credentials',
  })
  @ApiBody({ type: LoginUserDto })
  async login(@Body() loginUserDto: LoginUserDto) {
    const response = await this.usersService.login(loginUserDto);
    const { password, ...userWithoutPassword } = response.user;
    return {
      user: userWithoutPassword,
      accessToken: response.accessToken,
    };
  }

  @Get('list')
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'List of all users (without passwords)',
  })
  async findAll() {
    const users = await this.usersService.findAll();
    return users.map((user) => {
      const { password, ...result } = user;
      return result;
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({
    status: 200,
    description: 'User details (without password)',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @ApiParam({ name: 'id', description: 'User ID' })
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(id);
    const { password, ...result } = user;
    return result;
  }

  @Get('username/:username')
  @ApiOperation({ summary: 'Get user by username' })
  @ApiResponse({
    status: 200,
    description: 'User details (without password)',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @ApiParam({ name: 'username', description: 'Username' })
  async findByUsername(@Param('username') username: string) {
    const user = await this.usersService.findByUsername(username);
    const { password, ...result } = user;
    return result;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user details' })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - invalid input data',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict - username or email already exists',
  })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiBody({ type: UpdateUserDto })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const user = await this.usersService.updateUser(id, updateUserDto);
    const { password, ...result } = user;
    return result;
  }

  @Patch(':id/change-password')
  @ApiOperation({ summary: 'Change user password' })
  @ApiResponse({
    status: 200,
    description: 'Password changed successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - current password incorrect',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiBody({ type: ChangePasswordDto })
  async changePassword(
    @Param('id') id: string,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    await this.usersService.changePassword(id, changePasswordDto);
    return { message: 'Password updated successfully' };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user account' })
  @ApiResponse({
    status: 200,
    description: 'User deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @ApiParam({ name: 'id', description: 'User ID' })
  async remove(@Param('id') id: string) {
    await this.usersService.remove(id);
    return { message: 'User deleted successfully' };
  }

  @Patch(':id/deactivate')
  @ApiOperation({ summary: 'Deactivate user account' })
  @ApiResponse({
    status: 200,
    description: 'User deactivated successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @ApiParam({ name: 'id', description: 'User ID' })
  async deactivate(@Param('id') id: string) {
    const user = await this.usersService.deactivate(id);
    const { password, ...result } = user;
    return result;
  }

  @Patch(':id/activate')
  @ApiOperation({ summary: 'Activate user account' })
  @ApiResponse({
    status: 200,
    description: 'User activated successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @ApiParam({ name: 'id', description: 'User ID' })
  async activate(@Param('id') id: string) {
    const user = await this.usersService.activate(id);
    const { password, ...result } = user;
    return result;
  }

  @Patch(':id/rating')
  @ApiOperation({ summary: 'Update user rating' })
  @ApiResponse({
    status: 200,
    description: 'Rating updated successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @ApiParam({ name: 'id', description: 'User ID' })
  async updateRating(@Param('id') id: string, @Body('rating') rating: number) {
    const user = await this.usersService.updateRating(id, rating);
    const { password, ...result } = user;
    return result;
  }

  @Patch(':userId/solved-problems/:problemId')
  @ApiOperation({ summary: 'Add solved problem to user profile' })
  @ApiResponse({
    status: 200,
    description: 'Problem added to solved list',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiParam({ name: 'problemId', description: 'Problem ID' })
  async addSolvedProblem(
    @Param('userId') userId: string,
    @Param('problemId') problemId: string,
  ) {
    const user = await this.usersService.addSolvedProblem(userId, problemId);
    const { password, ...result } = user;
    return result;
  }
}
