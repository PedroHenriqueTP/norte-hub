import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDto {
    @IsString()
    organizationName!: string; // Name of the Tenant

    @IsString()
    name!: string; // Name of the User (Admin)

    @IsEmail()
    email!: string;

    @IsString()
    @MinLength(6)
    password!: string;
}

export class LoginDto {
    @IsEmail()
    email!: string;

    @IsString()
    password!: string;
}
