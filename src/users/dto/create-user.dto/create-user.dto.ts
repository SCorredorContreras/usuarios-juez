import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString, Length, Matches } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
    @ApiProperty({
        description: 'Unique username (3-30 chars, letters, numbers, _, -)',
        example: 'john_doe'
    })
    @IsNotEmpty()
    @IsString()
    @Length(3, 30)
    @Matches(/^[a-zA-Z0-9_-]+$/)
    username: string;

    @ApiProperty({
        description: 'Valid email address',
        example: 'john@example.com'
    })
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({
        description: 'Password (8-100 chars, 1 uppercase, 1 lowercase, 1 number)',
        example: 'Password123'
    })
    @IsNotEmpty()
    @IsString()
    @Length(8, 100)
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]+$/)
    password: string;

    @ApiProperty({
        description: 'First name',
        required: false,
        example: 'John'
    })
    @IsOptional()
    @IsString()
    firstName?: string;

    @ApiProperty({
        description: 'Last name',
        required: false,
        example: 'Doe'
    })
    @IsOptional()
    @IsString()
    lastName?: string;

    @ApiProperty({
        description: 'URL to profile picture',
        required: false,
        example: 'https://example.com/profile.jpg'
    })
    @IsOptional()
    @IsString()
    profilePicture?: string;

    @ApiProperty({
        description: 'User biography (max 500 chars)',
        required: false,
        example: 'Software developer from New York'
    })
    @IsOptional()
    @IsString()
    @Length(0, 500)
    bio?: string;
}

export class UpdateUserDto {
    @ApiProperty({
        description: 'New username (optional)',
        required: false,
        example: 'new_username'
    })
    @IsOptional()
    @IsString()
    @Length(3, 30)
    @Matches(/^[a-zA-Z0-9_-]+$/)
    username?: string;

    @ApiProperty({
        description: 'New email (optional)',
        required: false,
        example: 'new@example.com'
    })
    @IsOptional()
    @IsEmail()
    email?: string;

    @ApiProperty({
        description: 'New password (optional)',
        required: false,
        example: 'NewPassword123'
    })
    @IsOptional()
    @IsString()
    @Length(8, 100)
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]+$/)
    password?: string;

    @ApiProperty({
        description: 'First name (optional)',
        required: false,
        example: 'John'
    })
    @IsOptional()
    @IsString()
    firstName?: string;

    @ApiProperty({
        description: 'Last name (optional)',
        required: false,
        example: 'Doe'
    })
    @IsOptional()
    @IsString()
    lastName?: string;

    @ApiProperty({
        description: 'New profile picture URL (optional)',
        required: false,
        example: 'https://example.com/new_profile.jpg'
    })
    @IsOptional()
    @IsString()
    profilePicture?: string;

    @ApiProperty({
        description: 'Updated biography (optional)',
        required: false,
        example: 'Senior software developer'
    })
    @IsOptional()
    @IsString()
    @Length(0, 500)
    bio?: string;

    @ApiProperty({
        description: 'User role (optional)',
        required: false,
        example: 'user'
    })
    @IsOptional()
    @IsString()
    @Matches(/^(user)$/)
    role?: string;

    @ApiProperty({
        description: 'Account active status (optional)',
        required: false,
        example: true
    })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}

export class ChangePasswordDto {
    @ApiProperty({
        description: 'Current password',
        example: 'CurrentPassword123'
    })
    @IsNotEmpty()
    @IsString()
    currentPassword: string;

    @ApiProperty({
        description: 'New password (8-100 chars, 1 uppercase, 1 lowercase, 1 number)',
        example: 'NewPassword123'
    })
    @IsNotEmpty()
    @IsString()
    @Length(8, 100)
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]+$/)
    newPassword: string;
}

export class LoginUserDto {
    @ApiProperty({
        description: 'Username',
        example: 'john_doe'
    })
    @IsNotEmpty()
    @IsString()
    username: string;

    @ApiProperty({
        description: 'Password',
        example: 'Password123'
    })
    @IsNotEmpty()
    @IsString()
    password: string;
}