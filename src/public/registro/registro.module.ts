import { Module } from '@nestjs/common';
import { RegistroController } from './registro.controller';
import { RegistroService } from './registro.service';
import { ConexionModule } from 'src/config/conexion/conexion.module';

@Module({
  imports: [
    ConexionModule
  ],
  controllers: [RegistroController],
  providers: [RegistroService]
})
export class RegistroModule {}
