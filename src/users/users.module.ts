import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { ConexionModule } from 'src/config/conexion/conexion.module';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule { }
