import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/models/entities/user/user';
import { GenerarToken } from 'src/utilities/funciones/generar-token/generar-token';
import { compareSync } from 'bcrypt';

@Injectable()
export class AccesoService {
  constructor(
    @InjectRepository(User)
    private readonly usuarioRepositorio: Repository<User>,
  ) { }

  /* Servicio Inicio de Sesion */
  async inicioSesion(objUsuario: User): Promise<any> {
    const existe = await this.usuarioRepositorio.findBy({ username: objUsuario.username });
    if (existe.length != 0) {
      let codigoUsuario = existe[0].codUser;
      let claveUsuario = existe[0].password;
      if (compareSync(objUsuario.password, claveUsuario)) {
        try {
          let datosUsuario = await this.usuarioRepositorio.findOne({ where: { codUser: codigoUsuario }, relations: ["rolUsuario"] });
          if (!datosUsuario) {
            throw new HttpException("Usuario no encontrado", 404);
          }

          const token = GenerarToken.procesarRespuesta(datosUsuario);
          return new HttpException({ "tokenApp": token }, 200);
        } catch (e) {
          throw new HttpException("Fallo en la verificación del usuario", 400);
        }
      } else {
        return new HttpException("Contraseña inválida", 406);
      }
    } else {
      return new HttpException("Usuario no existe", 409);
    }
  }
}