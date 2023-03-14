import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import { Stadium } from "../../stadium/models/stadium.model";

interface CategoryAttrs {
    name: string;
    parent_id: number;
}

@Table({ tableName: 'category' })
export class Category extends Model<Category, CategoryAttrs> {
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
    name: string;

    @ForeignKey(() => Category)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    parent_id: number;

    @BelongsTo(() => Category)
    parent: Category;

    @HasMany(() => Stadium)
    stadium: Stadium;
}
