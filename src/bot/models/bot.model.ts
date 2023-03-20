import { Column, DataType, Model, Sequelize, Table } from "sequelize-typescript";
import { ApiProperty } from '@nestjs/swagger';

interface BotAttr {
    user_id: number;
    username: string;
    first_name: string;
    last_name: string;
    phone_number: string;
    status: boolean;
}

@Table({ tableName: 'bot' })
export class Bot extends Model<Bot, BotAttr> {
    @ApiProperty({
        example: 123456789,
        description: 'User id'
    })
    @Column({
        type: DataType.BIGINT,
        primaryKey: true,
        allowNull: false
    })
    user_id: number;

    @ApiProperty({
        example: 'john77',
        description: 'User name'
    })
    @Column({
        type: DataType.STRING,
    })
    username: string;

    @ApiProperty({
        example: 'John',
        description: 'User first name'
    })
    @Column({
        type: DataType.STRING,
    })
    first_name: string;

    @ApiProperty({
        example: 'Doe',
        description: 'User last name'
    })
    @Column({
        type: DataType.STRING,
    })
    last_name: string;

    @ApiProperty({
        example: '+998991234567',
        description: 'User phone number'
    })
    @Column({
        type: DataType.STRING,
    })
    phone_number: string;

    @ApiProperty({
        example: false,
        description: 'User status'
    })
    @Column({
        type: DataType.BOOLEAN,
    })
    status: boolean;
}
