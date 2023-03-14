import { Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import { ComfortStadium } from "../../comfort_stadium/models/comfort_stadium.model";

interface ComfortAttrs {
    name: string;
}

@Table({ tableName: 'comfort' })
export class Comfort extends Model<Comfort, ComfortAttrs> {
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

    @HasMany(() => ComfortStadium)
    comfortStadium: ComfortStadium;
}
