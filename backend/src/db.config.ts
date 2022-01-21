import { MikroORM } from "@mikro-orm/core";
import path from "path";
import { __prod__ } from "./constant/constants";
import { Post } from "./model/Post";
import { User } from "./model/User";
require("dotenv").config();

const {
  DB_NAME,
  DB_HOST,
  DB_PORT,
  DB_USER,
  DB_PASSWORD,
  DB_TYPE
} = process.env;

const config = {
  migrations: {
    path: path.join(__dirname, "./migrations"),
    pattern: /^[\w-]+\d+\.[tj]s$/,
  },
  entities: [Post, User],
  type: "postgresql",
  debug: !__prod__,
  clientUrl: `${DB_TYPE}://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`,
} as Parameters<typeof MikroORM.init>[0];

export default config;
