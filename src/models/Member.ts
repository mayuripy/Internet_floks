import {
  BelongsToGetAssociationMixin,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
} from "@sequelize/core";
import {
  Attribute,
  Default,
  NotNull,
  PrimaryKey,
  Table,
} from "@sequelize/core/decorators-legacy";
import { Community } from "./Community";
import { User } from "./User";
import { Role } from "./Role";

@Table({ schema: "public" })
export class Member extends Model<
  InferAttributes<Member>,
  InferCreationAttributes<Member>
> {
  @Attribute(DataTypes.STRING)
  @PrimaryKey
  @NotNull
  declare id: string;

  declare community?: NonAttribute<Community>;
  @Attribute(DataTypes.STRING)
  @NotNull
  declare communityId: string;

  declare user?: NonAttribute<User>;
  @Attribute(DataTypes.STRING)
  @NotNull
  declare userId: string;
  
  declare role?: NonAttribute<Role>;
  @Attribute(DataTypes.STRING)
  @NotNull
  declare roleId: string;

  @Attribute(DataTypes.DATE)
  @Default(new Date())
  declare createdAt?: Date;
  
  @Attribute(DataTypes.DATE)
  @Default(new Date())
  declare updatedAt?: Date;

  declare getCommunity: BelongsToGetAssociationMixin<Community>;
  declare getRole: BelongsToGetAssociationMixin<Role>;
  declare getUser: BelongsToGetAssociationMixin<User>;

}
