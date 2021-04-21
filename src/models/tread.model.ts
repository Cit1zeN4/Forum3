import { Field, ID, Int, ObjectType } from "type-graphql";
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

  @Field((type) => User, { nullable: true })
  @ManyToOne(() => User, (user) => user.threads, { nullable: true })
  author: User;

  @Field((type) => Thread, { nullable: true })
  @ManyToOne(() => Thread, (thread) => thread.subThreads, { nullable: true })
  parentTread?: Thread;

  @Field((type) => [Thread], { nullable: true })
  @OneToMany(() => Thread, (thread) => thread.parentTread, { nullable: true })
  subThreads: Thread[];

  @Field((type) => [Message], { nullable: true })
  @OneToMany(() => Message, (message) => message.thread, { nullable: true })
  messages: Message[];

  @Field((type) => Boolean)
  @Column()
  isClosed: boolean;

  @Field((type) => Boolean)
  @Column()
  isArchived: boolean;
}
