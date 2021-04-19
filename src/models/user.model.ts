import { Field, ID, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Message } from "./message.model";
import { Thread } from "./tread.model";

@Entity()
@ObjectType()
export class User extends BaseEntity {
  @Field((type) => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field((type) => String)
  @Column()
  username: string;

  @Field((type) => String)
  @Column()
  email: string;

  @Field((type) => String)
  @Column()
  password: string;

  @Field((type) => String)
  @Column({ nullable: true })
  name: string;

  @Field((type) => String)
  @Column({ nullable: true })
  surname: string;

  @Field((type) => [Thread], { nullable: true })
  @OneToMany(() => Thread, (thread) => thread.author)
  threads: Thread[];

  @Field((type) => [Message])
  @OneToMany(() => Message, (message) => message.author)
  messages: Message[];
}
