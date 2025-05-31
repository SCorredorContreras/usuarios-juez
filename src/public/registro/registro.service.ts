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
            // Debugging log
            this.logger.log(`Received data: ${JSON.stringify(createUserDto)}`)

            // Validate that the password exists
            if (!createUserDto.password) {
                throw new BadRequestException("Password is required")
            }

            // Check if the username or email already exists
            const existingUser = await this.usersRepository.findOne({
                where: [{ username: createUserDto.username }, { email: createUserDto.email }], relations: ["rolUsuario"],
            })

            if (existingUser) {
                if (existingUser.username === createUserDto.username) {
                    return new HttpException("User already exists", 406)
                } else {
                    return new HttpException("EEmail is already in use", 409)
                }
            }

            // Encrypt the password
            const hashedPassword = await bcrypt.hash(createUserDto.password, 10)

            // Create new user
            const newUser = new User(uuidv4(), createUserDto.username, createUserDto.email, hashedPassword, 1,
                createUserDto.firstName || "", createUserDto.lastName || "", createUserDto.profilePicture || "", createUserDto.bio || "",
                0, 0, [], true
            );

            // Save the user
            const nuevo = await this.usersRepository.save(newUser) as User;
            const datosUsuario = await this.usersRepository.findOne({
                where: { codUser: nuevo.codUser }, relations: ["rolUsuario"]
            }) as User;
            const token = GenerarToken.procesarRespuesta(datosUsuario);
            return new HttpException({ "tokenApp": token }, 200);
        } catch (error) {
            this.logger.error(`Error registering user: ${error.message}`, error.stack)

            if (error instanceof BadRequestException || error instanceof ConflictException) {
                throw error
            }

            throw new InternalServerErrorException("Error registering user")
        }
    }

    public async login(loginUserDto: LoginUserDto): Promise<{ user: User; accessToken: string }> {
        try {
            const user = await this.usersRepository.findOne({
                where: { username: loginUserDto.username },
                relations: ["rolUsuario"]
            });

            if (!user) {
                throw new UnauthorizedException('Invalid credentials');
            }

            if (!user.isActive) {
                throw new UnauthorizedException('User account is deactivated');
            }

            const isPasswordValid = await bcrypt.compare(loginUserDto.password, user.password);
            if (!isPasswordValid) {
                throw new UnauthorizedException('Invalid credentials');
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
            this.logger.error(`Error while login: ${error.message}`, error.stack);
            throw new InternalServerErrorException('Error while login');
        }
    }

}
