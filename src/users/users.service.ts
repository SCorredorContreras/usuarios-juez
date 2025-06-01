import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { DataSource, In, Repository } from 'typeorm';
import { User } from './models/entities/user/user';
import { ChangePasswordDto, CreateUserDto, LoginUserDto, UpdateUserDto } from './dto/create-user.dto/create-user.dto';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { Logger } from '@nestjs/common';
import { GenerarToken } from 'src/utilities/funciones/generar-token/generar-token';


@Injectable()
export class UsersService {

    private usersRepository: Repository<User>;

    private readonly logger = new Logger(UsersService.name);

    constructor(
        private poolConexion: DataSource
    ) {
        this.usersRepository = poolConexion.getRepository(User);
    }

    public async createUser(createUserDto: CreateUserDto): Promise<User> {
        try {
            // Log for debugging
            //this.logger.log(`Datos recibidos: ${JSON.stringify(createUserDto)}`)

            // Make sure that the password exists
            if (!createUserDto.password) {
                throw new BadRequestException("Password is required")
            }

            // Verify if the user or email already exists
            const existingUser = await this.usersRepository.findOne({
                where: [{ username: createUserDto.username }, { email: createUserDto.email }],
            })

            if (existingUser) {
                if (existingUser.username === createUserDto.username) {
                    throw new ConflictException("User already exists")
                } else {
                    throw new ConflictException("EEmail is already in use")
                }
            }

            // Encrypt the password
            const hashedPassword = await bcrypt.hash(createUserDto.password, 10)

            // Create new user
            const newUser = new User(uuidv4(), createUserDto.username, createUserDto.email, hashedPassword, 3,
                createUserDto.firstName || "", createUserDto.lastName || "", createUserDto.profilePicture || "", createUserDto.bio || "",
                0, 0, [], true
            );

            // Save the user
            return await this.usersRepository.save(newUser)
        } catch (error) {
            this.logger.error(`Error while registering user: ${error.message}`, error.stack)

            if (error instanceof BadRequestException || error instanceof ConflictException) {
                throw error
            }

            throw new InternalServerErrorException("Error while registering user")
        }
    }

    public async login(loginUserDto: LoginUserDto): Promise<{ user: User; accessToken: string }> {
        try {
            const user = await this.usersRepository.findOne({
                where: { username: loginUserDto.username }
            });

            if (!user) {
                throw new UnauthorizedException('Invalid credentials');
            }

            if (!user.isActive) {
                throw new UnauthorizedException('The user account is deactivated');
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
            if (error instanceof UnauthorizedException) {
                throw error;
            }
            this.logger.error(`Error during login: ${error.message}`, error.stack);
            throw new InternalServerErrorException('Error during login');
        }
    }

    public async findAll(): Promise<User[]> {
        try {
            return await this.usersRepository.find();
        } catch (error) {
            this.logger.error(`Error while fetching users: ${error.message}`, error.stack);
            throw new InternalServerErrorException('Error while fetching users');
        }
    }

    public async findOne(id: string): Promise<User> {
        try {
            const user = await this.usersRepository.findOne({
                where: { codUser: id }
            });

            if (!user) {
                throw new NotFoundException(`User with ID ${id} not found`);
            }

            return user;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            this.logger.error(`Error fetching user: ${error.message}`, error.stack);
            throw new InternalServerErrorException('Error fetching user');
        }
    }

    public async findByUsername(username: string): Promise<User> {
        try {
            const user = await this.usersRepository.findOne({
                where: { username }
            });

            if (!user) {
                throw new NotFoundException(`User with username ${username} not found`);
            }

            return user;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            this.logger.error(`Error fetching user by username: ${error.message}`, error.stack);
            throw new InternalServerErrorException('Error fetching user by username');
        }
    }

    public async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
        try {
            const user = await this.findOne(id);

            // If updating username or email, check for existing user with that value
            if (updateUserDto.username && updateUserDto.username !== user.username) {
                const existingUsername = await this.usersRepository.findOne({
                    where: { username: updateUserDto.username }
                });
                if (existingUsername) {
                    throw new ConflictException('Username already exists');
                }
            }

            if (updateUserDto.email && updateUserDto.email !== user.email) {
                const existingEmail = await this.usersRepository.findOne({
                    where: { email: updateUserDto.email }
                });
                if (existingEmail) {
                    throw new ConflictException('Email already exists');
                }
            }

            // If updating password, hash it
            if (updateUserDto.password) {
                updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
            }

            // Update user
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
            this.logger.error(`Error deactivating user: ${error.message}`, error.stack);
            throw new InternalServerErrorException('Error deactivating user');
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
            this.logger.error(`Error activating user: ${error.message}`, error.stack);
            throw new InternalServerErrorException('Error activating user');
        }
    }

    public async changePassword(id: string, changePasswordDto: ChangePasswordDto): Promise<void> {
        try {
            const user = await this.findOne(id);

            // Check current password
            const isCurrentPasswordValid = await bcrypt.compare(
                changePasswordDto.currentPassword,
                user.password
            );

            if (!isCurrentPasswordValid) {
                throw new BadRequestException('Current password is incorrect');
            }

            // Update password
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

            // Check if the problem is already in the array of solved problems
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
