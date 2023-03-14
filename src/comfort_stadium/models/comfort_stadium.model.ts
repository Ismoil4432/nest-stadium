import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Stadium } from "../../stadium/models/stadium.model";
import { Comfort } from "../../comfort/models/comfort.model";

interface ComfortStadiumAttrs {
    stadium_id: number;
    comfort_id: number;
}

@Table({ tableName: 'comfort_stadium' })
export class ComfortStadium extends Model<ComfortStadium, ComfortStadiumAttrs> {
    @Column({
        type: DataType.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        unique: true
    })
    id: number;

    // @ForeignKey(() => Stadium)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    stadium_id: number;

    @ForeignKey(() => Comfort)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    comfort_id: number;

    // @BelongsTo(()=>Stadium)
    // stadium: Stadium;

    @BelongsTo(() => Comfort)
    comfort: Comfort;
}
