import { Body, Controller, Post } from '@nestjs/common';
import { AccesoService } from './acceso.service';
import { ApiOperation, ApiResponse, ApiBody, ApiTags } from '@nestjs/swagger';

@Controller('acceso')
@ApiTags('Authentication')
export class AccesoController {
    constructor(private readonly accesoService: AccesoService) { }

    /**
     * Handles user login requests
     * @param {any} objUsuario - User credentials (username and password)
     * @returns {Promise<any>} Response with user data (without password) and JWT token or error
     * 
     * @ApiOperation User login endpoint
     * @ApiBody Requires username and password in request body
     * @ApiResponse 200 Returns user data and access token (password excluded)
     * @ApiResponse 400 Bad request
     * @ApiResponse 404 User not found
     * @ApiResponse 406 Invalid password
     * @ApiResponse 409 User doesn't exist
     */
    @Post('login')
    @ApiOperation({ summary: 'Authenticate user and get access token' })
    @ApiResponse({ 
        status: 200, 
        description: 'Returns user data (without password) and JWT token',
        schema: {
            example: {
                user: {
                    /* User data without password field */
                },
                accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
            }
        }
    })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiResponse({ status: 404, description: 'User not found' })
    @ApiResponse({ status: 406, description: 'Invalid password' })
    @ApiResponse({ status: 409, description: 'User does not exist' })
    async inicioSesion(@Body() objUsuario: any) {
        const response = await this.accesoService.inicioSesion(objUsuario);

        // Handle different response structures from the service
        if (response.user && response.accessToken) {
            // Remove password from user data before returning
            const { password, ...userWithoutPassword } = response.user;
            return {
                user: userWithoutPassword,
                accessToken: response.accessToken
            };
        }

        // Return raw response if not in expected format
        return response;
    }
}