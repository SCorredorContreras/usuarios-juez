import { Body, Controller, Post } from '@nestjs/common';
import { RegistroService } from './registro.service';   
import { CreateUserDto, LoginUserDto } from 'src/users/dto/create-user.dto/create-user.dto';

@Controller('registro')
export class RegistroController {

     constructor(private readonly resgistroService: RegistroService) { }
    
      @Post('crear')
      async register(@Body() createUserDto: CreateUserDto) {
        const user = await this.resgistroService.createUser(createUserDto);
        const { password, ...result } = user;
        return result;
      }
    
      @Post('login')
      async login(@Body() loginUserDto: LoginUserDto) {
        const response = await this.resgistroService.login(loginUserDto);
    
        // Extraer el password del objeto user anidado
        const { password, ...userWithoutPassword } = response.user;
    
        // Devolver la estructura correcta
        return {
          user: userWithoutPassword,
          accessToken: response.accessToken
        };
      }
    


}
