import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConexionModule } from './config/conexion/conexion.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { Seguridad } from './middleware/seguridad';
import { AccesoModule } from './public/acceso/acceso.module';
import { RegistroModule } from './public/registro/registro.module';

import { RolModule } from './rol/rol.module';

@Module({
  imports: [ConfigModule.forRoot({ envFilePath: ".env", isGlobal: true }), ConexionModule, UsersModule, AccesoModule, RegistroModule, RolModule],
  controllers: [AppController ],
  providers: [AppService],
})

export class AppModule implements NestModule {
  configure(seguridad: MiddlewareConsumer) {
      seguridad.apply(Seguridad).forRoutes('users')
  }
}