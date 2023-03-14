import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import { Stadium } from "../../stadium/models/stadium.model";
import { Cart } from "../../cart/models/cart.model";
import { Order } from "../../order/models/order.model";

interface StadiumTimeAttrs {
    stadium_id: number;
    start_time: Date;
    end_time: Date;
    price: number;
}

@Table({ tableName: 'stadium_time' })
export class StadiumTime extends Model<StadiumTime, StadiumTimeAttrs> {
    @Column({
        type: DataType.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        unique: true
    })
    id: number;

    @ForeignKey(() => Stadium)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    stadium_id: number;

    @Column({
        type: DataType.DATE,
        allowNull: false
    })
    start_time: Date;

    @Column({
        type: DataType.DATE,
        allowNull: false
    })
    end_time: Date;

    @Column({
        type: DataType.DECIMAL,
        allowNull: false
    })
    price: number;

    @BelongsTo(() => Stadium)
    stadium: Stadium;

    @HasMany(() => Cart)
    cart: Cart;

    @HasMany(() => Order)
    order: Order;
}
