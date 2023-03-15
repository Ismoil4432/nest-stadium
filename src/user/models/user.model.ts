import { Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import { UserCart } from "../../user_cart/models/user_cart.model";
import { Stadium } from "../../stadium/models/stadium.model";
import { Comment } from "../../comment/models/comment.model";
import { UserWallet } from "../../user_wallet/models/user_wallet.model";
import { Cart } from "../../cart/models/cart.model";
import { Order } from "../../order/models/order.model";

interface UserAttrs {
    first_name: string;
    last_name: string;
    username: string;
    hashed_password: string;
    telegram_link: string;
    email: string;
    phone: string;
    user_photo: string;
    birth_day: Date;
    is_owner: boolean;
    is_active: boolean;
    hashed_refresh_token: string;
    activation_link: string;
}

@Table({ tableName: 'user' })
export class User extends Model<User, UserAttrs> {
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
    first_name: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    last_name: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    username: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    hashed_password: string;

    // @Column({
    //     type: DataType.STRING,
    //     allowNull: false
    // })
    // telegram_link: string;

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
    phone: string;

    // @Column({
    //     type: DataType.STRING,
    //     allowNull: false
    // })
    // user_photo: string;

    @Column({
        type: DataType.DATE,
        allowNull: false
    })
    birth_day: Date;

    @Column({
        type: DataType.BOOLEAN,
        // allowNull: false
    })
    is_owner: boolean;

    @Column({
        type: DataType.BOOLEAN,
        // allowNull: false
    })
    is_active: boolean;

    @Column({
        type: DataType.STRING,
        // allowNull: false
    })
    hashed_refresh_token: string;

    @Column({
        type: DataType.STRING
    })
    activation_link: string;

    @HasMany(() => UserCart)
    userCart: UserCart;

    @HasMany(() => Stadium)
    stadium: Stadium;

    @HasMany(() => Comment)
    comment: Comment;

    @HasMany(() => UserWallet)
    userWallet: UserWallet;

    @HasMany(() => Cart)
    cart: Cart;

    @HasMany(() => Order)
    order: Order;
}
