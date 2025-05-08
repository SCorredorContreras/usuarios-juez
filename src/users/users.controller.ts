import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { ChangePasswordDto, CreateUserDto, LoginUserDto, UpdateUserDto } from './dto/create-user.dto/create-user.dto';

@Controller('users')
export class UsersController {

    constructor(private readonly usersService: UsersService) {}

    @Post('crear')
    async register(@Body() createUserDto: CreateUserDto) {
      const user = await this.usersService.createUser(createUserDto);
      const { password, ...result } = user;
      return result;
    }
  
    @Post('login')
    async login(@Body() loginUserDto: LoginUserDto) {
      const user = await this.usersService.login(loginUserDto);
      const { password, ...result } = user;
      return {
        user: result,
        // Nota: Aquí normalmente retornarías un token JWT, pero eso requiere un módulo de autenticación
      };
    }
  
    @Get()
    async findAll() {
      const users = await this.usersService.findAll();
      return users.map(user => {
        const { password, ...result } = user;
        return result;
      });
    }
  
    @Get(':id')
    async findOne(@Param('id') id: string) {
      const user = await this.usersService.findOne(id);
      const { password, ...result } = user;
      return result;
    }
  
    @Get('username/:username')
    async findByUsername(@Param('username') username: string) {
      const user = await this.usersService.findByUsername(username);
      const { password, ...result } = user;
      return result;
    }
  
    @Patch(':id')
    async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
      const user = await this.usersService.updateUser(id, updateUserDto);
      const { password, ...result } = user;
      return result;
    }
  
    @Patch(':id/change-password')
    async changePassword(@Param('id') id: string, @Body() changePasswordDto: ChangePasswordDto) {
      await this.usersService.changePassword(id, changePasswordDto);
      return { message: 'Password updated successfully' };
    }
  
    @Delete(':id')
    async remove(@Param('id') id: string) {
      await this.usersService.remove(id);
      return { message: 'User deleted successfully' };
    }
  
    @Patch(':id/deactivate')
    async deactivate(@Param('id') id: string) {
      const user = await this.usersService.deactivate(id);
      const { password, ...result } = user;
      return result;
    }
  
    @Patch(':id/activate')
    async activate(@Param('id') id: string) {
      const user = await this.usersService.activate(id);
      const { password, ...result } = user;
      return result;
    }
  
    @Patch(':id/rating')
    async updateRating(@Param('id') id: string, @Body('rating') rating: number) {
      const user = await this.usersService.updateRating(id, rating);
      const { password, ...result } = user;
      return result;
    }
  
    @Patch(':userId/solved-problems/:problemId')
    async addSolvedProblem(
      @Param('userId') userId: string,
      @Param('problemId') problemId: string
    ) {
      const user = await this.usersService.addSolvedProblem(userId, problemId);
      const { password, ...result } = user;
      return result;
    }

}
