import { BadRequestException, ConflictException, HttpException, Injectable, InternalServerErrorException, Logger, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto, LoginUserDto } from 'src/users/dto/create-user.dto/create-user.dto';
import { User } from 'src/users/models/entities/user/user';
import { DataSource, Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { GenerarToken } from 'src/utilities/funciones/generar-token/generar-token';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Injectable()
export class RegistroService {
    private usersRepository: Repository<User>;
    private readonly logger = new Logger(RegistroService.name);

    constructor(private poolConexion: DataSource) {
        this.usersRepository = poolConexion.getRepository(User);
    }

    /**
     * Creates a new user account with hashed password
     * @param createUserDto User registration data
     * @returns HTTP response with JWT token or error
     * @throws BadRequestException if password is missing
     * @throws HttpException(406) if username exists
     * @throws HttpException(409) if email exists
     * @throws InternalServerErrorException for database errors
     */
    @ApiOperation({ summary: 'Register a new user account' })
    @ApiResponse({ status: 200, description: 'Returns JWT token' })
    @ApiResponse({ status: 406, description: 'Username already exists' })
    @ApiResponse({ status: 409, description: 'Email already in use' })
    public async createUser(createUserDto: CreateUserDto): Promise<any> {
        try {
            this.logger.log(`Received data: ${JSON.stringify(createUserDto)}`);

            if (!createUserDto.password) {
                throw new BadRequestException("Password is required");
            }

            const existingUser = await this.usersRepository.findOne({
                where: [{ username: createUserDto.username }, { email: createUserDto.email }],
                relations: ["rolUsuario"],
            });

            if (existingUser) {
                if (existingUser.username === createUserDto.username) {
                    return new HttpException("User already exists", 406);
                } else {
                    return new HttpException("Email is already in use", 409);
                }
            }

            const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

            const newUser = new User(
                uuidv4(),
                createUserDto.username,
                createUserDto.email,
                hashedPassword,
                1,
                createUserDto.firstName || "",
                createUserDto.lastName || "",
                createUserDto.profilePicture || "",
                createUserDto.bio || "",
                0,
                0,
                [],
                true
            );

            const nuevo = await this.usersRepository.save(newUser) as User;
            const datosUsuario = await this.usersRepository.findOne({
                where: { codUser: nuevo.codUser },
                relations: ["rolUsuario"]
            }) as User;
            
            const token = GenerarToken.processResponse(datosUsuario);
            return new HttpException({ "tokenApp": token }, 200);
        } catch (error) {
            this.logger.error(`Error registering user: ${error.message}`, error.stack);
            throw new InternalServerErrorException("Error registering user");
        }
    }

    /**
     * Authenticates user and generates JWT token
     * @param loginUserDto User credentials
     * @returns User data with access token
     * @throws UnauthorizedException for invalid credentials or inactive account
     */
    @ApiOperation({ summary: 'Authenticate user' })
    @ApiResponse({ status: 200, description: 'Returns user data and JWT token' })
    @ApiResponse({ status: 401, description: 'Invalid credentials' })
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

            const token = GenerarToken.processResponse(user);

            return {
                user: user,
                accessToken: token
            };
        } catch (error) {
            this.logger.error(`Login error: ${error.message}`, error.stack);
            throw error;
        }
    }
}