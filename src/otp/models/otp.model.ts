import { Column, DataType, Model, Sequelize, Table } from "sequelize-typescript";
import { ApiProperty } from '@nestjs/swagger';

interface OtpAttr {
    id: string;
    otp: string;
    expiration_time: Date;
    verified: boolean;
    check: string;
}

@Table({ tableName: 'otp' })
export class Otp extends Model<Otp, OtpAttr> {
    @ApiProperty({
        example: "123a-456bv-789as-121s-asd24",
        description: 'OTP id'
    })
    @Column({
        type: DataType.UUID,
        primaryKey: true,
        allowNull: false
    })
    id: string;

    @ApiProperty({ example: '1909' })
    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    otp: string;

    @ApiProperty({ example: '2023-02-27T08:10:10.000Z' })
    @Column({
        type: DataType.DATE,
        allowNull: false
    })
    expiration_time: Date;

    @ApiProperty({ example: 'false' })
    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false
    })
    verified: boolean;

    @ApiProperty({ example: '9981234238' })
    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    check: string;
}
