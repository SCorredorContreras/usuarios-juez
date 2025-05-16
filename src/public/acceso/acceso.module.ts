import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccesoController } from './acceso.controller';
import { AccesoService } from './acceso.service';
import { User } from 'src/users/models/entities/user/user';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [AccesoController],
  providers: [AccesoService],
})
export class AccesoModule {}