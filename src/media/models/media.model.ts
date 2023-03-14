import { Column, DataType, Model, Table } from "sequelize-typescript";

interface MediaAttrs {
    stadium_id: number;
    photo: string;
    description: string;
}

@Table({ tableName: 'media' })
export class Media extends Model<Media, MediaAttrs> {
    @Column({
        type: DataType.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        unique: true
    })
    id: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    stadium_id: number;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    photo: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    description: string;
}
