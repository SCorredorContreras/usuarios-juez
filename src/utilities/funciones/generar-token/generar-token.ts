import { User } from "src/users/models/entities/user/user";
import { sign } from 'jsonwebtoken';

/**
 * Utility class for JWT token generation
 * 
 * @class GenerarToken
 * @description Provides static methods for JWT token generation and processing
 */
export class GenerarToken {

    /**
     * Generates and processes JWT token for user authentication
     * 
     * @static
     * @param {User} respuesta - User entity from database
     * @returns {string} Generated JWT token
     * 
     * @example
     * const token = GenerarToken.processResponse(user);
     */
    public static processResponse(respuesta: User): string {
        let token: string = "";
        
        // Log user data for debugging (removed in production)
        console.log(respuesta);
        
        /**
         * Create JWT token with user payload
         * @param {object} payload - Data to include in token
         * @param {string} respuesta.codUser - User ID
         * @param {string} respuesta.firstName - User's first name
         * @param {string} respuesta.email - User's email
         * @param {string} respuesta.rolUsuario.name - User's role name
         * @param {string} process.env.JWT_SECRET - Secret key from environment
         * @param {object} options - Token options (expires in 12 hours)
         */
        token = sign(
            {
                idUsuario: respuesta.codUser,
                nombreUsuario: respuesta.firstName,
                correoUsuario: respuesta.email,
                rolUsuario: respuesta.rolUsuario.name,
            },
            String(process.env.JWT_SECRET),
            { expiresIn: "12h" }
        );

        return token;
    }
}