import { Field, ID, InputType } from "type-graphql";
import { User } from "../models/user.model";

@InputType()
export class AddMessageInput {
  @Field((type) => String)
  text: string;

  @Field({ nullable: true })
  date: Date;

  @Field((type) => ID)
  authorId: string;

  @Field((type) => ID, { nullable: true })
  replyToId?: string;

  @Field((type) => ID)
  threadId: string;
}

@InputType()
export class EditMessageInput {
  @Field((type) => String, { nullable: true })
  text: string;

  @Field({ nullable: true })
  date: Date;

  @Field((type) => ID, { nullable: true })
  authorId: string;

  @Field((type) => ID, { nullable: true })
  replyToId?: string;

  @Field((type) => ID, { nullable: true })
  threadId: string;
}
