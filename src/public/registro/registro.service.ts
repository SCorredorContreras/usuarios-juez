import { BadRequestException, ConflictException, HttpException, Injectable, InternalServerErrorException, Logger, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto, LoginUserDto } from 'src/users/dto/create-user.dto/create-user.dto';
import { User } from 'src/users/models/entities/user/user';
import { UsersService } from 'src/users/users.service';
import { DataSource, Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { GenerarToken } from 'src/utilities/funciones/generar-token/generar-token';

@Injectable()
export class RegistroService {

    private usersRepository: Repository<User>;

    constructor(
        private poolConexion: DataSource
    ) {
        this.usersRepository = poolConexion.getRepository(User);
    }


    private readonly logger = new Logger(UsersService.name);

    public async createUser(createUserDto: CreateUserDto): Promise<any> {
        try {
            // Log para depuración
            this.logger.log(`Datos recibidos: ${JSON.stringify(createUserDto)}`)

            // Validar que la contraseña existe
            if (!createUserDto.password) {
                throw new BadRequestException("La contraseña es obligatoria")
            }

            // Verificar si el usuario o email ya existen
            const existingUser = await this.usersRepository.findOne({
                where: [{ username: createUserDto.username }, { email: createUserDto.email }], relations: ["rolUsuario"],
            })

            if (existingUser) {
                if (existingUser.username === createUserDto.username) {
                    return new HttpException("El usuario ya existe", 406)
                } else {
                    return new HttpException("El email ya está en uso", 409)
                }
            }

            // Encriptar la contraseña
            const hashedPassword = await bcrypt.hash(createUserDto.password, 10)

            // Crear nuevo usuario
            const newUser = new User(uuidv4(), createUserDto.username, createUserDto.email, hashedPassword, 1,
                createUserDto.firstName || "", createUserDto.lastName || "", createUserDto.profilePicture || "", createUserDto.bio || "",
                0, 0, [], true
            );

            // Guardar el usuario
            const nuevo = await this.usersRepository.save(newUser) as User;
            const datosUsuario = await this.usersRepository.findOne({
                where: { codUser: nuevo.codUser }, relations: ["rolUsuario"]
            }) as User;
            const token = GenerarToken.procesarRespuesta(datosUsuario);
            return new HttpException({ "tokenApp": token }, 200);
        } catch (error) {
            this.logger.error(`Error registrando usuario: ${error.message}`, error.stack)

            if (error instanceof BadRequestException || error instanceof ConflictException) {
                throw error
            }

            throw new InternalServerErrorException("Error registrando usuario")
        }
    }

    public async login(loginUserDto: LoginUserDto): Promise<{ user: User; accessToken: string }> {
        try {
            const user = await this.usersRepository.findOne({
                where: { username: loginUserDto.username }
            });

            if (!user) {
                throw new UnauthorizedException('Credenciales no son validas');
            }

            if (!user.isActive) {
                throw new UnauthorizedException('La cuenta del usuario esta desactivada');
            }

            const isPasswordValid = await bcrypt.compare(loginUserDto.password, user.password);
            if (!isPasswordValid) {
                throw new UnauthorizedException('credenciales no son validas');
            }

            const token = GenerarToken.procesarRespuesta(user);

            return {
                user: user,
                accessToken: token
            };

        } catch (error) {
            if (error instanceof UnauthorizedException) {
                throw error;
            }
            this.logger.error(`Error durante login: ${error.message}`, error.stack);
            throw new InternalServerErrorException('Error durante login');
        }
    }

}
