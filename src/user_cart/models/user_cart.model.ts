import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { User } from "../../user/models/user.model";

interface UserCartAttrs {
    user_id: number;
    name: string;
    phone: string;
    number: string;
    year: number;
    month: number;
    is_active: boolean;
    is_main: boolean;
}

@Table({ tableName: 'user_cart' })
export class UserCart extends Model<UserCart, UserCartAttrs> {
    @Column({
        type: DataType.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        unique: true
    })
    id: number;

    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    user_id: number;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    name: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    phone: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    number: string;

    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    year: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    month: number;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false
    })
    is_active: boolean;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false
    })
    is_main: boolean;

    @BelongsTo(() => User)
    user: User;
}
