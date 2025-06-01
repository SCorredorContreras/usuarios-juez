import { Body, Controller, Post } from '@nestjs/common';
import { RegistroService } from './registro.service';
import { CreateUserDto, LoginUserDto } from 'src/users/dto/create-user.dto/create-user.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@Controller('registro')
@ApiTags('Authentication')
export class RegistroController {
    constructor(private readonly resgistroService: RegistroService) {}

    /**
     * Endpoint for user registration
     * @param createUserDto User registration data
     * @returns Registration result with token
     */
    @Post('crear')
    @ApiOperation({ summary: 'Register new user' })
    @ApiBody({ type: CreateUserDto })
    @ApiResponse({ 
        status: 200, 
        description: 'Returns authentication token' 
    })
    @ApiResponse({ 
        status: 406, 
        description: 'Username already exists' 
    })
    @ApiResponse({ 
        status: 409, 
        description: 'Email already in use' 
    })
    async register(@Body() createUserDto: CreateUserDto) {
        const user = await this.resgistroService.createUser(createUserDto);
        const { password, ...result } = user;
        return result;
    }

    /**
     * Endpoint for user authentication
     * @param loginUserDto User credentials
     * @returns User data with access token (password excluded)
     */
    @Post('login')
    @ApiOperation({ summary: 'Authenticate user' })
    @ApiBody({ type: LoginUserDto })
    @ApiResponse({ 
        status: 200, 
        description: 'Returns user data and access token' 
    })
    @ApiResponse({ 
        status: 401, 
        description: 'Invalid credentials' 
    })
    async login(@Body() loginUserDto: LoginUserDto) {
        const response = await this.resgistroService.login(loginUserDto);
        const { password, ...userWithoutPassword } = response.user;
        return {
            user: userWithoutPassword,
            accessToken: response.accessToken
        };
    }
}