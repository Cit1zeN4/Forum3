import { Arg, Args, Mutation, Query, Resolver } from "type-graphql";
import { getRepository } from "typeorm";
import { PaginationArgs } from "../inputs/common.args";
import { AddUserInput, EditUserInput } from "../inputs/user.input";
import { Message } from "../models/message.model";
import { Thread } from "../models/thread.model";
import { User } from "../models/user.model";

@Resolver(User)
export class UserResolver {
  @Query((returns) => [User])
  async users(@Args() { skip, take }: PaginationArgs) {
    return await User.find({ skip, take });
  }

  @Query((returns) => User)
  async getUser(@Arg("id") id: string) {
    return await User.findOne(id);
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
    const user = User.create(data);
    return await user.save();
  }

  @Mutation((returns) => Boolean)
  async editUser(@Arg("id") id: string, @Arg("data") data: EditUserInput) {
    const result = await User.update({ id }, data);
    const updated = <number>result.affected;
    return updated > 0;
  }

  @Mutation((returns) => Boolean)
  async deleteUser(@Arg("id") id: string) {
    const result = await User.delete({ id });
    const deleted = <number>result.affected;
    return deleted > 0;
  }
}
