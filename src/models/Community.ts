import {
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
} from "@sequelize/core";
import {
  Attribute,
  BelongsTo,
  Default,
  HasMany,
  NotNull,
  PrimaryKey,
  Table,
} from "@sequelize/core/decorators-legacy";
import { User } from "./User";
import { Member } from "./Member";

@Table({ schema: "public" })
export class Community extends Model<
  InferAttributes<Community>,
  InferCreationAttributes<Community>
> {
  @Attribute(DataTypes.STRING)
  @PrimaryKey
  @NotNull
  declare id: string;

  @Attribute(DataTypes.STRING(128))
  @NotNull
  declare name: string;

  @Attribute(DataTypes.STRING(255))
  declare slug: string;

  @Attribute(DataTypes.DATE)
  @Default(new Date())
  declare createdAt?: Date;

  @Attribute(DataTypes.DATE)
  @Default(new Date())
  declare updatedAt?: Date;
  
  @HasMany(() => Member, {
    foreignKey: "communityId",
    inverse: {
      as: "community"
    }
  })
  declare members?: NonAttribute<Member[]>;

  @BelongsTo(() => User, {
    foreignKey: "ownerId",
    inverse: {
      as: "ownedCommunities",
      type: "hasMany"
    }
  })
  declare owner?: NonAttribute<User>;

  @Attribute(DataTypes.STRING)
  @NotNull
  declare ownerId: string;

  declare getOwner: BelongsToGetAssociationMixin<User>;

  declare setOwner: BelongsToSetAssociationMixin<User, Community["ownerId"]>;
}
