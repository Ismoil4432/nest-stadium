import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsEmail, IsNotEmpty, IsPhoneNumber, IsString, IsStrongPassword, MinLength } from "class-validator";

export class CreateUserDto {
    @ApiProperty({ example: 'John', description: 'Foydalanuvchi ismi' })
    @IsNotEmpty()
    @IsString()
    first_name: string;

    @ApiProperty({ example: 'Doe', description: 'Foydalanuvchi familiyasi' })
    @IsNotEmpty()
    @IsString()
    last_name: string;

    @ApiProperty({ example: 'john77', description: 'Foydalanuvchi usernamei' })
    @IsNotEmpty()
    @IsString()
    username: string;

    @ApiProperty({ example: 'Uzbek1$t0n', description: 'Foydalanuvchi paroli' })
    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    @IsStrongPassword()
    password: string;

    @ApiProperty({ example: 'Uzbek1$t0n', description: 'Foydalanuvchi paroli qaytadan' })
    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    confirm_password: string;

    // @ApiProperty({ example: 'https://t.me/john77', description: 'Foydalanuvchi telegram linki' })
    // @IsNotEmpty()
    // @IsString()
    // telegram_link: string;
    
    @ApiProperty({ example: 'john77@gmail.com', description: 'Foydalanuvchi emaili' })
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({ example: '+998998414432', description: 'Foydalanuvchi telefon raqami' })
    @IsNotEmpty()
    @IsPhoneNumber()
    phone: string;

    @ApiProperty({ example: '2000-01-31', description: "Foydalanuvchi tug'ilgan kuni" })
    @IsNotEmpty()
    @IsDateString()
    birth_day: Date;
}
