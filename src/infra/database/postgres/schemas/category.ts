import { Column, DataType, Model, Table } from 'sequelize-typescript'

@Table({ timestamps: true, tableName: 'categories', underscored: true })
export class CategorySchema extends Model {
  @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
  id: number

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  name: string

  @Column(DataType.STRING)
  description?: string

  @Column(DataType.STRING)
  icon: string

  @Column(DataType.STRING)
  iconAltText?: string

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: true })
  active?: boolean
}
