import { dedupExchange, fetchExchange } from "urql";
import { API_URL } from "../constants";
import { betterUpdateQuery } from "./betterUpdateQuery";
import { cacheExchange } from "@urql/exchange-graphcache";
import { LoginMutation, MeQuery, MeDocument, LogoutMutation } from "../generated/graphql";

export const createUrqlClient = (ssrExchange: any) => ({
  url: API_URL,
  fetchOptions: {
    credentials: "include" as const ,
  },
  exchanges: [
    dedupExchange,
    cacheExchange({
      updates: {
        Mutation: {
          login: (_result, args, cache, info) => {
            betterUpdateQuery<LoginMutation, MeQuery>(
              cache,
              { query: MeDocument },
              _result,
              (result, query) => {
                if (result.login.errors) {
                  return query;
                } else {
                  return {
                    me: result.login.user,
                  }
                }
              }
            );
          },
          logout: (_result, args, cache, info) => {
            betterUpdateQuery<LogoutMutation, MeQuery>(
              cache,
              { query: MeDocument },
              _result,
              () => ({ me: null })
            );
          },
        },
        Subscription: {
          subscriptionField: (result, args, cache, info) => {
            // ...
          },
        },
      },
    }),
    ssrExchange,
    fetchExchange,
  ],
});