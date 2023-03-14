import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import { User } from "../../user/models/user.model";
import { Cart } from "../../cart/models/cart.model";
import { Order } from "../../order/models/order.model";

interface UserWalletAttrs {
    user_id: number;
    wallet: number;
}

@Table({ tableName: 'user_wallet' })
export class UserWallet extends Model<UserWallet, UserWalletAttrs> {
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
        type: DataType.INTEGER,
        allowNull: false
    })
    wallet: number;

    @BelongsTo(() => User)
    user: User;

    @HasMany(() => Cart)
    cart: Cart;

    @HasMany(() => Order)
    order: Order;
}
