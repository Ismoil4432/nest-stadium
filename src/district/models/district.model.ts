import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import { Region } from "../../region/models/region.model";
import { Stadium } from "../../stadium/models/stadium.model";

interface DistrictAttrs {
    name: string;
    region_id: number;
}

@Table({ tableName: 'district' })
export class District extends Model<District, DistrictAttrs> {
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

    @ForeignKey(() => Region)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    region_id: number;

    @BelongsTo(() => Region)
    region: Region;

    @HasMany(() => Stadium)
    stadium: Stadium;
}
