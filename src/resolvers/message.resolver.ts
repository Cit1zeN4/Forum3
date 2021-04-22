import { Arg, Args, Mutation, Query, Resolver } from "type-graphql";
import { PaginationArgs } from "../inputs/common.args";
import { AddMessageInput, EditMessageInput } from "../inputs/message.input";
import { Message } from "../models/message.model";
import { Thread } from "../models/tread.model";
import { User } from "../models/user.model";

@Resolver(Message)
export class MessageResolver {
  @Query((returns) => [Message])
  async messages(@Args() { skip, take }: PaginationArgs) {
    return await Message.find({ skip, take });
  }

  @Query((returns) => Message)
  async getMessage(@Arg("id") id: string) {
    return await Message.findOne(id);
  }

  @Mutation((returns) => Message)
  async addMessage(@Arg("data") data: AddMessageInput) {
    const message = Message.create(data);
    message.date = new Date();
    if (data.authorId) message.author = await User.findOneOrFail(data.authorId);
    if (data.threadId)
      message.thread = await Thread.findOneOrFail(data.threadId);
    if (data.replyToId)
      message.replyTo = await Message.findOneOrFail(data.replyToId);
    const result = await message.save();
    return result;
  }

  @Mutation((returns) => Boolean)
  async updateMessage(
    @Arg("id") id: string,
    @Arg("data") data: EditMessageInput
  ) {
    const result = await Message.update({ id }, data);
    const updated = <number>result.affected;
    return updated > 0;
  }
}
