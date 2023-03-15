import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty } from "class-validator";

export class ActivateUserDto {
    @ApiProperty({ example: '1', description: 'Foydalanuvchini active/deactive qilish' })
    @IsNotEmpty()
    @IsInt()
    readonly user_id: number;
}
