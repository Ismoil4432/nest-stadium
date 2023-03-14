import { Column, DataType, Model, Table } from "sequelize-typescript";

interface AdminAttrs {
    username: string;
    email: string;
    telegram_link: string;
    admin_photo: string;
    hashed_password: string;
    is_active: boolean;
    is_creator: boolean;
    hashed_refresh_token: string;
}

@Table({ tableName: 'admin' })
export class Admin extends Model<Admin, AdminAttrs> {
    @Column({
        type: DataType.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        unique: true
    })
    id: number;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    username: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: true
    })
    email: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    telegram_link: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    admin_photo: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    hashed_password: string;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false
    })
    is_active: boolean;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false
    })
    is_creator: boolean;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    hashed_refresh_token: string;
}
