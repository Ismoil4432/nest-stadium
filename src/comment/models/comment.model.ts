import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { User } from "../../user/models/user.model";
import { Stadium } from "../../stadium/models/stadium.model";

interface CommentAttrs {
    user_id: number;
    stadium_id: number;
    impression: string;
}

@Table({ tableName: 'comment' })
export class Comment extends Model<Comment, CommentAttrs> {
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

    @ForeignKey(() => Stadium)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    stadium_id: number;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    impression: string;

    @BelongsTo(() => User)
    user: User;

    @BelongsTo(() => Stadium)
    stadium: Stadium;
}
