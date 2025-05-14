import {
  DataTypes,
  HasManyGetAssociationsMixin,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
} from "@sequelize/core";
import {
  Attribute,
  BeforeCreate,
  Default,
  HasMany,
  NotNull,
  PrimaryKey,
  Table,
  Unique,
} from "@sequelize/core/decorators-legacy";
import { IsEmail } from "@sequelize/validator.js";
import { hashPassword } from "../utils";
import { Community } from "./Community";
import { Member } from "./Member";

@Table({ schema: "public" })
export class User extends Model<
  InferAttributes<User>,
  InferCreationAttributes<User>
> {
  @Attribute(DataTypes.STRING)
  @PrimaryKey
  @NotNull
  declare id: string;

  @Attribute(DataTypes.STRING)
  @Default("")
  declare name?: string;

  @Attribute(DataTypes.STRING)
  @Unique
  @NotNull
  @IsEmail
  declare email: string;

  @Attribute(DataTypes.STRING)
  @NotNull
  declare password: string;

  @Attribute(DataTypes.DATE)
  @Default(new Date())
  declare createdAt?: Date;

  @Attribute(DataTypes.DATE)
  @Default(new Date())
  declare updatedAt?: Date;

  @HasMany(() => Member, {
    foreignKey: "userId",
    inverse: {
      as: "user",
    },
  })
  declare isMemberOf?: NonAttribute<Member[]>;

  declare ownedCommunities?: NonAttribute<Community[]>;

  declare getOwnedCommunities: HasManyGetAssociationsMixin<Community>;

  @BeforeCreate
  static async hashPass(user: User) {
    user.password = await hashPassword(user.password);
    return;
  }
}
