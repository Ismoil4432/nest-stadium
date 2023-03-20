import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginAuthDto {
    @ApiProperty({ example: 'john77@gmail.com', description: 'Foydalanuvchi emaili' })
    @IsNotEmpty()
    @IsEmail()
    readonly email: string;

    @ApiProperty({ example: 'Uzbek1$t0n', description: 'Foydalanuvchi paroli' })
    @IsNotEmpty()
    @IsString()
    readonly password: string;
}