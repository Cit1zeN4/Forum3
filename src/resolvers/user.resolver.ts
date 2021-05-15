import { Arg, Args, Mutation, Query, Resolver } from "type-graphql";
import passwordHash from "password-hash";
import { PaginationArgs } from "../inputs/common.args";
import { AddUserInput, EditUserInput } from "../inputs/user.input";
import { Message } from "../models/message.model";
import { Thread } from "../models/thread.model";
import { User } from "../models/user.model";
import { QueryFailedError } from "typeorm/error";

@Resolver(User)
export class UserResolver {
  @Query((returns) => [User])
  async users(@Args() { skip, take }: PaginationArgs) {
    return await User.find({ skip, take });
  }

  @Query((returns) => User)
  async getUser(@Arg("id") id: string) {
    return await User.findOne(id, { relations: ["threads", "messages"] });
  }

  @Query((returns) => [Message])
  async getUserMessages(
    @Arg("id") id: string,
    @Args() { skip, take }: PaginationArgs
  ) {
    return await Message.find({ where: { id }, skip, take });
  }

  @Query((returns) => [Thread])
  async getUserThreads(
    @Arg("id") id: string,
    @Args() { skip, take }: PaginationArgs
  ) {
    return await Thread.find({ where: { id }, skip, take });
  }

  @Mutation((returns) => User)
  async addUser(@Arg("data") data: AddUserInput) {
    data.password = passwordHash.generate(data.password);
    let user = User.create(data);
    try {
      return await user.save();
    } catch (error) {
      if (error instanceof QueryFailedError) {
        if (((<any>error).detail as string).includes("username"))
          throw new Error(`User with username: ${user.username} already exist`);
        if (((<any>error).detail as string).includes("email"))
          throw new Error(`User with email: ${user.email} already exist`);
      } else throw error;
    }
  }

  @Mutation((returns) => Boolean)
  async editUser(@Arg("id") id: string, @Arg("data") data: EditUserInput) {
    try {
      if (data.password) data.password = passwordHash.generate(data.password);
      const result = await User.update({ id }, data);
      const updated = <number>result.affected;
      return updated > 0;
    } catch (error) {
      if (error instanceof QueryFailedError) {
        if (((<any>error).detail as string).includes("username"))
          throw new Error(`User with username: ${data.username} already exist`);
        if (((<any>error).detail as string).includes("email"))
          throw new Error(`User with email: ${data.email} already exist`);
      } else throw error;
    }
  }

  @Mutation((returns) => Boolean)
  async deleteUser(@Arg("id") id: string) {
    const result = await User.delete({ id });
    const deleted = <number>result.affected;
    return deleted > 0;
  }
}
