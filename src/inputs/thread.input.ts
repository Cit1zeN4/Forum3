import { Field, ID, InputType } from "type-graphql";
import { Message } from "../models/message.model";
import { Thread } from "../models/thread.model";
import { User } from "../models/user.model";

@InputType()
export class AddThreadInput {
  @Field((type) => String)
  title: string;

  @Field((type) => String, { nullable: true })
  description: string;

  @Field((type) => ID)
  authorId: string;

  @Field((type) => ID, { nullable: true })
  parentThreadId?: string;

  @Field((type) => Boolean, { defaultValue: false })
  isClosed: boolean;

  @Field((type) => Boolean, { defaultValue: false })
  isArchived: boolean;
}

@InputType()
export class EditThreadInput {
  @Field((type) => String)
  title: string;

  @Field((type) => String, { nullable: true })
  description: string;

  @Field((type) => Boolean, { defaultValue: false })
  isClosed: boolean;

  @Field((type) => Boolean, { defaultValue: false })
  isArchived: boolean;
}
