import {
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/models/entities/user/user';
import { GenerarToken } from 'src/utilities/funciones/generar-token/generar-token';
import { compareSync } from 'bcrypt';
import { Logger } from '@nestjs/common';

import { UsersService } from 'src/users/users.service';

@Injectable()
export class AccesoService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private readonly usuarioRepositorio: Repository<User>,
  ) {}

  /**
   * Handles user login authentication
   * @param {User} objUsuario - User credentials (username and password)
   * @returns {Promise<any>} HTTP response with JWT token or error
   *
   * @throws {HttpException} 404 if user not found in database
   * @throws {HttpException} 400 if user verification fails
   * @throws {HttpException} 406 if password is invalid
   * @throws {HttpException} 409 if username doesn't exist
   *
   * @ApiOperation Authenticate user login
   * @ApiResponse 200 Returns JWT token on success
   * @ApiResponse 404 User not found in database
   * @ApiResponse 400 User verification failed
   * @ApiResponse 406 Invalid password
   * @ApiResponse 409 User doesn't exist
   */
  async inicioSesion(objUsuario: User): Promise<any> {
    // Check if username exists
    const existe = await this.usuarioRepositorio.findBy({
      username: objUsuario.username,
    });

    if (existe.length != 0) {
      let codigoUsuario = existe[0].codUser;
      let claveUsuario = existe[0].password;

      // Verify password match
      if (compareSync(objUsuario.password, claveUsuario)) {
        try {
          // Get full user details with role information
          let datosUsuario = await this.usuarioRepositorio.findOne({
            where: { codUser: codigoUsuario },
            relations: ['rolUsuario'],
          });

          if (!datosUsuario) {
            throw new HttpException('User not found', 404);
          }

          // Generate JWT token
          const token = GenerarToken.processResponse(datosUsuario);
          return new HttpException({ tokenApp: token }, 200);
        } catch (e) {
          throw new HttpException('Failed to verify user', 400);
        }
      } else {
        return new HttpException('Invalid password', 406);
      }
    } else {
      return new HttpException('User does not exist', 409);
    }
  }

  public async findAll(): Promise<User[]> {
    try {
      return await this.usuarioRepositorio.find({
        relations: ['rolUsuario'],
      });
    } catch (error) {
      this.logger.error(
        `Error while fetching users: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException('Error while fetching users');
    }
  }
}
