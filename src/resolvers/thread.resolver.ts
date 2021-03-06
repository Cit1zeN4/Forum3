import {
  Arg,
  Args,
  Int,
  Mutation,
  PubSub,
  PubSubEngine,
  Query,
  Resolver,
  Root,
  Subscription,
} from "type-graphql";
import { PaginationArgs } from "../inputs/common.args";
import { AddThreadInput } from "../inputs/thread.input";
import { Thread } from "../models/thread.model";
import { User } from "../models/user.model";

const NEW_THREAD = "NEW_THREAD";
const DELETED_THREAD = "DELETED_THREAD";

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
      where: {
        parentTread: null,
      },
    });

    return result;
  }

  @Query((returns) => Int)
  async threadCount() {
    const result = await Thread.find({ where: { parentTread: null } });
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
  async addThread(
    @PubSub() pubSub: PubSubEngine,
    @Arg("data") data: AddThreadInput
  ) {
    const thread = Thread.create(data);
    if (data.authorId) thread.author = await User.findOneOrFail(data.authorId);
    if (data.parentThreadId)
      thread.parentTread = await Thread.findOneOrFail(data.parentThreadId);
    const result = await thread.save();
    await pubSub.publish(NEW_THREAD, result);
    return result;
  }

  @Mutation((returns) => Boolean)
  async deleteThread(@PubSub() pubSub: PubSubEngine, @Arg("id") id: string) {
    const result = await Thread.delete({ id });
    const deleted = <number>result.affected;
    return deleted > 0;
  }

  @Subscription((returns) => Thread, {
    topics: NEW_THREAD,
  })
  newThread(@Root() thread: Thread) {
    return thread;
  }

  @Subscription((returns) => Thread, {
    topics: DELETED_THREAD,
  })
  deletedThread(@Root() thread: Thread) {
    return thread;
  }
}
