import { Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import { District } from "../../district/models/district.model";
import { Stadium } from "../../stadium/models/stadium.model";

interface RegionAttrs {
    name: string;
}

@Table({ tableName: 'region' })
export class Region extends Model<Region, RegionAttrs> {
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

    @HasMany(() => District)
    district: District;

    @HasMany(() => Stadium)
    stadium: Stadium;
}
