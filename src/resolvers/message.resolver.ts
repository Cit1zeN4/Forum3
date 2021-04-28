import {
  Arg,
  Args,
  Mutation,
  PubSub,
  PubSubEngine,
  Query,
  Resolver,
  Root,
  Subscription,
} from "type-graphql";
import { PaginationArgs } from "../inputs/common.args";
import { AddMessageInput, EditMessageInput } from "../inputs/message.input";
import { Message } from "../models/message.model";
import { Thread } from "../models/thread.model";
import { User } from "../models/user.model";

const NEW_MESSAGE = "NEW_MESSAGE";
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

  @Query((returns) => [Message])
  async getThreadMessages(@Arg("id") id: string) {
    const thread = await Thread.findOne({
      where: { id },
      relations: ["messages"],
    });
    if (!thread) return new Error(`Can't find thread with id: ${id}`);
    return thread.messages;
  }

  @Mutation((returns) => Message)
  async addMessage(
    @PubSub() pubSub: PubSubEngine,
    @Arg("data") data: AddMessageInput
  ) {
    const message = Message.create(data);
    message.date = new Date();
    if (data.authorId) message.author = await User.findOneOrFail(data.authorId);
    if (data.threadId)
      message.thread = await Thread.findOneOrFail(data.threadId);
    if (data.replyToId)
      message.replyTo = await Message.findOneOrFail(data.replyToId);
    const result = await message.save();
    await pubSub.publish(NEW_MESSAGE, result);
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

  @Subscription((returns) => Message, {
    topics: NEW_MESSAGE,
  })
  newMessage(@Root() message: Message) {
    return message;
  }
}
