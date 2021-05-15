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
import { authRouter } from "./routes/auth.router";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

async function main() {
  const app = express();
  const ws = createServer(app);

  app.use(
    cors({
      origin: ["http://localhost:8080", "https://studio.apollographql.com"],
      optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204.
      credentials: true,
    })
  );
  app.use(cookieParser());
  app.use(bodyParser.json());
  app.use(authRouter());

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
