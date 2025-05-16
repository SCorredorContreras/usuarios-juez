import { Injectable, type NestMiddleware } from "@nestjs/common"
import type { NextFunction } from "express"
import { verify } from "jsonwebtoken"

@Injectable()
export class Seguridad implements NestMiddleware {
  use(req: any, res: any, next: NextFunction) {
    console.log("Middleware de seguridad ejecutándose")
    console.log("Headers:", req.headers)

    if (!req.headers.authorization) {
      console.log("No se encontró el header de autorización")
      return res.status(401).json({ respuesta: "Petición negada por el sistema de seguridad" })
    }

    try {
      const authHeader = req.headers.authorization


      const token = authHeader.split(" ")[1]

      if (!token) {
        return res.status(401).json({ respuesta: "Token no proporcionado" })
      }

      // Verificar el token
      const datosUsuario = verify(token, String(process.env.JWT_SECRET))
      console.log("Token verificado correctamente, datos del usuario:", datosUsuario)

      // Adjuntar los datos del usuario a la solicitud para uso posterior
      req.user = datosUsuario

      next()
    } catch (error) {
      return res.status(401).json({
        mensaje: "Intento de fraude",
        error: error.message,
      })
    }
  }
}
