import { User } from "../model/User";
import { MyContext } from "../type";
import { Arg, Ctx, Field, InputType, Mutation, ObjectType, Query, Resolver } from "type-graphql";
import argon2 from "argon2";

@InputType()
class UsernamePasswordInput {
  @Field()
  username: string;

  @Field()
  password: string;
}

@ObjectType()
class FieldError {
  @Field()
  field: string
  @Field()
  message: string
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[]

  @Field(() => User, { nullable: true })
  user?: User
}


@Resolver()
export class UserResolver {
  hashPassword = async (password: string) => {
    return argon2.hash(password);
  }

  @Query(() => User, { nullable: true })
  async me(
    @Ctx() { em, req }: MyContext
  ): Promise<User | null> {
    const userId = req.session.userID;
    if (!userId) {
      return null;
    }
    const user = await em.findOne(User, { id: userId });
    return user;
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg('options') options: UsernamePasswordInput,
    @Ctx() { em }: MyContext
  ) : Promise<UserResponse> {
    const { username, password } = options;
    const hashedPassword = await this.hashPassword(password);
    const isUserExists = await em.count(User, { username });
    if (isUserExists) {
      return {
        errors: [{
          field: 'username',
          message: 'username already exists'
        }]
      }
    }
    const user = em.create(User, {
      username,
      password: hashedPassword
    });
    await em.persistAndFlush(user);
    return {user};
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg('options') options: UsernamePasswordInput,
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    const {
      username,
      password
    } = options;
    const user = await em.findOne(User, {
      username,
    });
    const error = {
      errors: [{
        field: 'username',
        message: 'username or password is incorrect'
      }]
    }
    const validPassword = user && await argon2.verify(user.password, password);
    if (!user || !validPassword) {
      return error
    }
    req.session.userID = user.id;
    console.log(req.sessionID);
    return { user };
  }
}
