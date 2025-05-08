import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConexionModule } from './config/conexion/conexion.module';
import { UsersService } from './users/users.service';
import { UsersModule } from './users/users.module';
import { UsersController } from './users/users.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({ envFilePath: ".env", isGlobal: true }), ConexionModule, UsersModule],
  controllers: [AppController, UsersController],
  providers: [AppService, UsersService],
})
export class AppModule {}