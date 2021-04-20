import { Field, InputType } from "type-graphql";
import { User } from "../models/user.model";

@InputType()
export class AddUserInput {
  @Field((type) => String)
  username: string;

  @Field((type) => String)
  email: string;

  @Field((type) => String)
  password: string;

  @Field((type) => String, { nullable: true })
  name?: string;

  @Field((type) => String, { nullable: true })
  surname?: string;
}

@InputType()
export class EditUserInput {
  @Field((type) => String, { nullable: true })
  username: string;

  @Field((type) => String, { nullable: true })
  email: string;

  @Field((type) => String, { nullable: true })
  password: string;

  @Field((type) => String, { nullable: true })
  name?: string;

  @Field((type) => String, { nullable: true })
  surname?: string;
}
