import { User } from "src/users/models/entities/user/user";
import { sign } from 'jsonwebtoken';


export class GenerarToken {

    /*generar token del usuario*/

    public static procesarRespuesta(respuesta: User): string {

        let token: string = "";
        console.log(respuesta);
        
        token = sign(
            {
                idUsuario: respuesta.codUser,
                nombreUsuario: respuesta.firstName,
                correoUsuario: respuesta.email,
                rolUsuario: respuesta.rolUsuario.name,
            },
            String(process.env.JWT_SECRET),

            { expiresIn: "12h" });


        return token;


    }


}
