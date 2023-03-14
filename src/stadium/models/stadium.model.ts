import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import { User } from "../../user/models/user.model";
import { Category } from "../../category/models/category.model";
import { Region } from "../../region/models/region.model";
import { District } from "../../district/models/district.model";
import { Comment } from "../../comment/models/comment.model";
import { StadiumTime } from "../../stadium_time/models/stadium_time.model";

interface StadiumAttrs {
    category_id: number;
    owner_id: number;
    contact_with: string;
    name: string;
    volume: string;
    address: string;
    region_id: number;
    district_id: number;
    location: string;
    buildAt: Date;
    start_time: Date;
    end_time: Date;
}

@Table({ tableName: 'stadium' })
export class Stadium extends Model<Stadium, StadiumAttrs> {
    @Column({
        type: DataType.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        unique: true
    })
    id: number;

    @ForeignKey(() => Category)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    category_id: number;

    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    owner_id: number;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    contact_with: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    name: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    volume: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    address: string;

    @ForeignKey(() => Region)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    region_id: number;

    @ForeignKey(() => District)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    district_id: number;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    location: string;

    @Column({
        type: DataType.DATE,
        allowNull: false
    })
    buildAt: Date;

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

    @BelongsTo(() => Category)
    category: Category;

    @BelongsTo(() => User)
    user: User;

    @BelongsTo(() => Region)
    region: Region;

    @BelongsTo(() => District)
    district: District;

    @HasMany(() => Comment)
    comment: Comment;

    @HasMany(() => StadiumTime)
    stadiumTime: StadiumTime;
}
