import { Arg, Args, Int, Mutation, Query, Resolver } from "type-graphql";
import { PaginationArgs } from "../inputs/common.args";
import { AddThreadInput } from "../inputs/thread.input";
import { Thread } from "../models/tread.model";
import { User } from "../models/user.model";

@Resolver(Thread)
export class ThreadResolver {
  @Query((returns) => [Thread])
  async threads(@Args() { skip, take }: PaginationArgs) {
    return await Thread.find({ skip, take, order: { title: "ASC" } });
  }

  @Query((returns) => [Thread])
  async threadsWithRelations(@Args() { skip, take }: PaginationArgs) {
    const result = await Thread.find({
      skip,
      take,
      relations: ["messages", "messages.author", "subThreads", "parentTread"],
      order: { title: "ASC" },
    });

    return result;
  }

  @Query((returns) => Int)
  async threadCount() {
    const result = await Thread.find();
    return result.length;
  }

  @Query((returns) => Thread)
  async threadWithRelation(@Arg("id") id: string) {
    const thread = await Thread.findOne(id, {
      relations: ["messages", "messages.author", "subThreads", "author"],
    });
    if (!thread) throw new Error(`Can't find thread with id:${id}`);
    return thread;
  }

  @Mutation((returns) => Thread)
  async addThread(@Arg("data") data: AddThreadInput) {
    const thread = Thread.create(data);
    if (data.authorId) thread.author = await User.findOneOrFail(data.authorId);
    if (data.parentThreadId)
      thread.parentTread = await Thread.findOneOrFail(data.parentThreadId);
    return await thread.save();
  }
}
