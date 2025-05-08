import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from './models/entities/user/user';
import { ChangePasswordDto, CreateUserDto, LoginUserDto, UpdateUserDto } from './dto/create-user.dto/create-user.dto';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { Logger } from '@nestjs/common';



@Injectable()
export class UsersService {

    private usersRepository: Repository<User>;

    private readonly logger = new Logger(UsersService.name);


    constructor(
        private poolConexion: DataSource
    ){
        this.usersRepository = poolConexion.getRepository(User);
    }

    public async createUser(createUserDto: CreateUserDto): Promise<User> {
        try {
            // Verificar si el usuario o email ya existen
            const existingUser = await this.usersRepository.findOne({
                where: [
                    { username: createUserDto.username },
                    { email: createUserDto.email }
                ]
            });

            if (existingUser) {
                if (existingUser.username === createUserDto.username) {
                    throw new ConflictException('El usuario ya existe');
                } else {
                    throw new ConflictException('El emmail ya esta en uso');
                }
            }

            // Encriptar la contraseña
            const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

            // Crear nuevo usuario
            const newUser = this.usersRepository.create({
                codUser: uuidv4(),
                username: createUserDto.username,
                email: createUserDto.email,
                password: hashedPassword,
                firstName: createUserDto.firstName,
                lastName: createUserDto.lastName,
                profilePicture: createUserDto.profilePicture,
                bio: createUserDto.bio,
                role: 'user',
                rating: 0,
                totalProblemsSolved: 0,
                solvedProblems: [],
                isActive: true
            });

            return await this.usersRepository.save(newUser);
        } catch (error) {
            if (error instanceof ConflictException) {
                throw error;
            }
            this.logger.error(`Error registrando usuario: ${error.message}`, error.stack);
            throw new InternalServerErrorException('registrando usuario');
        }
    }

    public async login(loginUserDto: LoginUserDto): Promise<User> {
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
                throw new UnauthorizedException('Invalid credentials');
            }

            return user;
        } catch (error) {
            if (error instanceof UnauthorizedException) {
                throw error;
            }
            this.logger.error(`Error durante login: ${error.message}`, error.stack);
            throw new InternalServerErrorException('Error durante login');
        }
    }

    public async findAll(): Promise<User[]> {
        try {
            return await this.usersRepository.find();
        } catch (error) {
            this.logger.error(`Error al buscar usuarios: ${error.message}`, error.stack);
            throw new InternalServerErrorException('Error buscando usuarios');
        }
    }

    public async findOne(id: string): Promise<User> {
        try {
            const user = await this.usersRepository.findOne({
                where: { codUser: id }
            });

            if (!user) {
                throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
            }

            return user;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            this.logger.error(`Error bucando al usuario: ${error.message}`, error.stack);
            throw new InternalServerErrorException('Error buscando usuario');
        }
    }

    public async findByUsername(username: string): Promise<User> {
        try {
            const user = await this.usersRepository.findOne({
                where: { username }
            });

            if (!user) {
                throw new NotFoundException(`Usuario con el usuario ${username} no encontrado`);
            }

            return user;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            this.logger.error(`Error buscando al usuario por su username: ${error.message}`, error.stack);
            throw new InternalServerErrorException('Error buscando al usuario por su username');
        }
    }

    public async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
        try {
            const user = await this.findOne(id);

            // Si se está actualizando el username o email, verificar que no exista otro usuario con ese valor
            if (updateUserDto.username && updateUserDto.username !== user.username) {
                const existingUsername = await this.usersRepository.findOne({
                    where: { username: updateUserDto.username }
                });
                if (existingUsername) {
                    throw new ConflictException('Nombre de usuario ya existe');
                }
            }

            if (updateUserDto.email && updateUserDto.email !== user.email) {
                const existingEmail = await this.usersRepository.findOne({
                    where: { email: updateUserDto.email }
                });
                if (existingEmail) {
                    throw new ConflictException('Email ya existe');
                }
            }

            // Si se está actualizando la contraseña, encriptarla
            if (updateUserDto.password) {
                updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
            }

            // Actualizar usuario
            const updatedUser = this.usersRepository.merge(user, updateUserDto);
            return await this.usersRepository.save(updatedUser);
        } catch (error) {
            if (error instanceof NotFoundException || error instanceof ConflictException) {
                throw error;
            }
            this.logger.error(`Error updating user: ${error.message}`, error.stack);
            throw new InternalServerErrorException('Error updating user');
        }
    }

    public async deactivate(id: string): Promise<User> {
        try {
            const user = await this.findOne(id);
            user.isActive = false;
            return await this.usersRepository.save(user);
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            this.logger.error(`Error desactivando usuario: ${error.message}`, error.stack);
            throw new InternalServerErrorException('Error desactivando usuario');
        }
    }

    public async activate(id: string): Promise<User> {
        try {
            const user = await this.findOne(id);
            user.isActive = true;
            return await this.usersRepository.save(user);
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            this.logger.error(`Error activando usuario: ${error.message}`, error.stack);
            throw new InternalServerErrorException('Error activando usuario');
        }
    }


    public async changePassword(id: string, changePasswordDto: ChangePasswordDto): Promise<void> {
        try {
            const user = await this.findOne(id);

            // Verificar contraseña actual
            const isCurrentPasswordValid = await bcrypt.compare(
                changePasswordDto.currentPassword,
                user.password
            );

            if (!isCurrentPasswordValid) {
                throw new BadRequestException('Current password is incorrect');
            }

            // Actualizar contraseña
            user.password = await bcrypt.hash(changePasswordDto.newPassword, 10);
            await this.usersRepository.save(user);
        } catch (error) {
            if (error instanceof NotFoundException || error instanceof BadRequestException) {
                throw error;
            }
            this.logger.error(`Error changing password: ${error.message}`, error.stack);
            throw new InternalServerErrorException('Error changing password');
        }
    }

    public async remove(id: string): Promise<void> {
        try {
            const user = await this.findOne(id);
            await this.usersRepository.remove(user);
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            this.logger.error(`Error removing user: ${error.message}`, error.stack);
            throw new InternalServerErrorException('Error removing user');
        }
    }

    public async updateRating(id: string, newRating: number): Promise<User> {
        try {
            const user = await this.findOne(id);
            user.rating = newRating;
            return await this.usersRepository.save(user);
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            this.logger.error(`Error updating user rating: ${error.message}`, error.stack);
            throw new InternalServerErrorException('Error updating user rating');
        }
    }

    public async addSolvedProblem(userId: string, problemId: string): Promise<User> {
        try {
            const user = await this.findOne(userId);
            
            // Verificar si el problema ya está en el array de problemas resueltos
            if (!user.solvedProblems.includes(problemId)) {
                user.solvedProblems.push(problemId);
                user.totalProblemsSolved = user.solvedProblems.length;
                return await this.usersRepository.save(user);
            }
            
            return user;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            this.logger.error(`Error adding solved problem: ${error.message}`, error.stack);
            throw new InternalServerErrorException('Error adding solved problem');
        }
    }

}
