import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './models/entities/user/user';
import { ConexionModule } from 'src/config/conexion/conexion.module';

@Module({
    imports: [
        ConexionModule
      ],
      controllers: [UsersController],
      providers: [UsersService],
      exports: [UsersService]
})
export class UsersModule {}
