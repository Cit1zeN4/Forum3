import "reflect-metadata";
import cors from "cors";
import express from "express";
import { createServer } from "http";
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";
import { ApolloServer } from "apollo-server-express";
import { UserResolver } from "./resolvers/user.resolver";
import { ThreadResolver } from "./resolvers/thread.resolver";
import { MessageResolver } from "./resolvers/message.resolver";

async function main() {
  const app = express();
  const ws = createServer(app);

  app.use(cors());

  await createConnection();

  const schema = await buildSchema({
    resolvers: [UserResolver, MessageResolver, ThreadResolver],
    dateScalarMode: "timestamp",
  });

  const server = new ApolloServer({
    schema,
    subscriptions: {
      path: "/subscriptions",
    },
  });

  server.applyMiddleware({ app });
  server.installSubscriptionHandlers(ws);

  await ws.listen(4000);
  console.log("Server has started!");
}

main();
