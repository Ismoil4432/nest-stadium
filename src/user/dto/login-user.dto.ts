import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginUserDto {
    @ApiProperty({ example: 'john77@gmail.com', description: 'Foydalanuvchi emaili' })
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'Uzbek1$t0n', description: 'Foydalanuvchi paroli' })
    @IsNotEmpty()
    @IsString()
    password: string;
}