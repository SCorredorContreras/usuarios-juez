import { Body, Controller, Post } from '@nestjs/common';
import { AccesoService } from './acceso.service';

@Controller('acceso')
export class AccesoController {
    constructor(private readonly accesoService: AccesoService) { }

    @Post('login')
    async inicioSesion(@Body() objUsuario: any) {
        const response = await this.accesoService.inicioSesion(objUsuario);

        // Si inicioSesion ya devuelve { user, accessToken }
        if (response.user && response.accessToken) {
            // Extraer el password
            const { password, ...userWithoutPassword } = response.user;

            // Devolver la estructura correcta
            return {
                user: userWithoutPassword,
                accessToken: response.accessToken
            };
        }

        // Si inicioSesion devuelve otra estructura, simplemente pásala
        return response;
    }
}