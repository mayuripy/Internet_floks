import {
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    Model,
    NonAttribute,
  } from "@sequelize/core";
  import {
    Attribute,
    Default,
    HasMany,
    NotNull,
    PrimaryKey,
    Table,
  } from "@sequelize/core/decorators-legacy";
import { Member } from "./Member";
  
  @Table({ schema: "public" })
  export class Role extends Model<
    InferAttributes<Role>,
    InferCreationAttributes<Role>
  > {
    @Attribute(DataTypes.STRING)
    @PrimaryKey
    @NotNull
    declare id: string;
  
    @Attribute(DataTypes.STRING)
    @NotNull
    declare name: string;
  
    @Attribute(DataTypes.DATE)
    @Default(new Date())
    declare createdAt?: Date

    @Attribute(DataTypes.DATE)
    @Default(new Date())
    declare updatedAt?: Date

    @HasMany(() => Member, {
      foreignKey: "roleId",
      inverse: {
        as: "role"
      }
    })
    declare roleIs?: NonAttribute<Member[]>;
  }
  