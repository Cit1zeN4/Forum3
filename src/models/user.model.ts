import { Field, ID, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Message } from "./message.model";
import { Thread } from "./thread.model";

@Entity()
@ObjectType()
export class User extends BaseEntity {
  @Field((type) => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field((type) => String)
  @Column({ unique: true })
  username: string;

  @Field((type) => String)
  @Column({ unique: true })
  email: string;

  @Field((type) => String)
  @Column()
  password: string;

  @Field((type) => String, { nullable: true })
  @Column({ nullable: true })
  name: string;

  @Field((type) => String, { nullable: true })
  @Column({ nullable: true })
  surname: string;

  @Field((type) => [Thread], { nullable: true })
  @OneToMany(() => Thread, (thread) => thread.author, { onDelete: "CASCADE" })
  threads: Thread[];

  @Field((type) => [Message], { nullable: true })
  @OneToMany(() => Message, (message) => message.author, {
    onDelete: "CASCADE",
  })
  messages: Message[];
}
