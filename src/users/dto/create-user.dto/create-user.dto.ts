import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString, Length, Matches } from "class-validator";

export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    @Length(3, 30)
    @Matches(/^[a-zA-Z0-9_-]+$/, { message: 'Nombre de usuario solo puede contener letras, numeros, guiones bajos y guiones' })
    username: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    @Length(8, 100)
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]+$/, { 
        message: 'Contraseña tiene que contener al menos un letra mayuscula, una minuscula y un numero' 
    })
    password: string;

    @IsOptional()
    @IsString()
    firstName?: string;

    @IsOptional()
    @IsString()
    lastName?: string;

    @IsOptional()
    @IsString()
    profilePicture?: string;

    @IsOptional()
    @IsString()
    @Length(0, 500)
    bio?: string;
}

export class UpdateUserDto {
    @IsOptional()
    @IsString()
    @Length(3, 30)
    @Matches(/^[a-zA-Z0-9_-]+$/, { message: 'Nombre de usuario solo puede contener letras, numeros, guiones bajos y guiones' })
    username?: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsString()
    @Length(8, 100)
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]+$/, { 
        message: 'Contraseña tiene que contener al menos un letra mayuscula, una minuscula y un numero' 
    })
    password?: string;

    @IsOptional()
    @IsString()
    firstName?: string;

    @IsOptional()
    @IsString()
    lastName?: string;

    @IsOptional()
    @IsString()
    profilePicture?: string;

    @IsOptional()
    @IsString()
    @Length(0, 500)
    bio?: string;

    @IsOptional()
    @IsString()
    @Matches(/^(user)$/)
    role?: string;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}

export class ChangePasswordDto {
    @IsNotEmpty()
    @IsString()
    currentPassword: string;

    @IsNotEmpty()
    @IsString()
    @Length(8, 100)
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]+$/, { 
        message: 'Contraseña tiene que contener al menos un letra mayuscula, una minuscula y un numero' 
    })
    newPassword: string;
}

export class LoginUserDto {
    @IsNotEmpty()
    @IsString()
    username: string;

    @IsNotEmpty()
    @IsString()
    password: string;
}