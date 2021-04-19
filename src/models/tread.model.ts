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
import { Message } from "./message.model";
import { User } from "./user.model";

@Entity()
@ObjectType()
export class Thread extends BaseEntity {
  @Field((type) => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field((type) => String)
  @Column()
  title: string;

  @Field((type) => String, { nullable: true })
  @Column({ nullable: true })
  description: string;

  @Field((type) => User)
  @ManyToOne(() => User, (user) => user.threads)
  author: User;

  @Field((type) => Thread)
  @ManyToOne(() => Thread, (thread) => thread.subThreads)
  parentTread: Thread;

  @Field((type) => [Thread])
  @OneToMany(() => Thread, (thread) => thread.parentTread)
  subThreads: Thread[];

  @Field((type) => [Message])
  @OneToMany(() => Message, (message) => message.thread)
  messages: Message[];

  @Field((type) => Boolean)
  @Column()
  isClosed: boolean;

  @Field((type) => Boolean)
  @Column()
  isArchived: boolean;
}
