import { BelongsTo, Column, DataType, ForeignKey, Model, Sequelize, Table } from "sequelize-typescript";
import { User } from "../../user/models/user.model";
import { UserWallet } from "../../user_wallet/models/user_wallet.model";
import { StadiumTime } from "../../stadium_time/models/stadium_time.model";

interface OrderAttrs {
    user_id: number;
    user_wallet_id: number;
    stadium_time_id: number;
    date: Date;
    createdAt: Date;
    status_id: number;
}

@Table({ tableName: 'order' })
export class Order extends Model<Order, OrderAttrs> {
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

    @ForeignKey(() => UserWallet)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    user_wallet_id: number;

    @ForeignKey(() => StadiumTime)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    stadium_time_id: number;

    @Column({
        type: DataType.DATE,
        allowNull: false
    })
    date: Date;

    @Column({
        type: DataType.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    })
    createdAt: Date;

    // @ForeignKey(() => Status)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    status_id: number;

    @BelongsTo(() => User)
    user: User;

    @BelongsTo(() => UserWallet)
    userWallet: UserWallet;

    @BelongsTo(() => StadiumTime)
    stadiumTime: StadiumTime;

    // @BelongsTo(() => Status)
    // status: Status;
}
