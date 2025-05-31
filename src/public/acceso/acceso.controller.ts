import { Body, Controller, Post } from '@nestjs/common';
import { AccesoService } from './acceso.service';

@Controller('acceso')
export class AccesoController {
    constructor(private readonly accesoService: AccesoService) { }

    @Post('login')
    async inicioSesion(@Body() objUsuario: any) {
        const response = await this.accesoService.inicioSesion(objUsuario);

        // If inicioSesion already returns { user, accessToken }
        if (response.user && response.accessToken) {
            // Extract the password
            const { password, ...userWithoutPassword } = response.user;

            // Return the correct structure
            return {
                user: userWithoutPassword,
                accessToken: response.accessToken
            };
        }

        // If inicioSesion returns a different structure, just pass it through
        return response;
    }
}