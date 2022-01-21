import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { ObjectType, Field, Int } from "type-graphql";
import argon2 from "argon2";

@ObjectType() // GraphQl type
@Entity()
export class User {
  @Field(() => Int) //define graphql type
  @PrimaryKey()
  id!: number;

  @Field(() => String)
  @Property({ type: 'date' })
  createdAt = new Date();

  @Field(() => String)
  @Property({ type: 'date', onUpdate: () => new Date() })
  updatedAt = new Date();

  @Field()
  @Property({ type: 'text', unique: true })
  username!: string;

  @Property({ type: 'text' })
  password!: string;

  validatePassword(password: string): Promise<boolean> {
    return argon2.verify(this.password, password);
  }
}