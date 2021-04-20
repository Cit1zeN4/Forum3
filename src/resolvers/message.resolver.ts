import { Arg, Args, Query, Resolver } from "type-graphql";
import { PaginationArgs } from "../inputs/common.args";
import { Message } from "../models/message.model";

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
}
