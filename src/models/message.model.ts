import { Field, ID, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Tree,
  TreeChildren,
  TreeParent,
} from "typeorm";
import { Thread } from "./tread.model";
import { User } from "./user.model";

@Entity()
@ObjectType()
export class Message extends BaseEntity {
  @Field((type) => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field((type) => String)
  @Column()
  text: string;

  @Field()
  @Column()
  date: Date;

  @Field((type) => User)
  @ManyToOne(() => User, (user) => user.messages)
  author: User;

  @Field((type) => Message, { nullable: true })
  @ManyToOne(() => Message, (message) => message.replies)
  replyTo: Message;

  @Field((type) => [Message], { nullable: true })
  @OneToMany(() => Message, (message) => message.replyTo)
  replies: Message[];

  @Field((type) => Thread)
  @ManyToOne(() => Thread, (thread) => thread.messages)
  thread: Thread;
}
