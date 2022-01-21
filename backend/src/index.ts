import 'reflect-metadata';
import { MikroORM } from "@mikro-orm/core";
import { WEB_URL, __prod__ } from "./constant/constants";
import config from "./db.config";
import express from "express";
import { PORT } from "./constant/constants";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { PostResolver } from './resolver/Post';
import { UserResolver } from './resolver/User';
const redis = require('redis')
const session = require('express-session')

const RedisStore = require('connect-redis')(session)
import { MyContext } from './type';
import cors from 'cors';

const main = async () => {
  const orm = await MikroORM.init(config);
  await orm.getMigrator().up();
  // const em
  const app = express();

  const redisClient = redis.createClient();
  app.use(cors({
    origin: WEB_URL,
    credentials: true,
  }))
  
  app.use(
    session({
      name: 'qid',
      store: new RedisStore({
        client: redisClient,
        disableTouch: true,
        // disableTTL: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
        httpOnly: true,
        secure: __prod__,
        sameSite: 'lax',
      },
      saveUninitialized: false,
      secret: 'super scret key',
      resave: false,
    })
  )

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [PostResolver, UserResolver],
      validate: false
    }),
    context: ({ req, res }): MyContext => ({ em: orm.em, req, res })
  })
  // await apolloServer.start()
  // const post = orm.em.create(Post, {title:'abc'})
  // await orm.em.persistAndFlush(post);
  apolloServer.applyMiddleware({
    app,
    cors: false,
  });

  app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
};

main().catch((err) => {
  console.error(err);
});
