import { Query, Resolver } from "type-graphql";
import { User } from "../models/user.model";

@Resolver()
export class UserResolver {
  @Query(() => User)
  async users() {
    return User.find();
  }
}
