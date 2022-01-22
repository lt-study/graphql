import { ChakraProvider, ColorModeProvider } from "@chakra-ui/react";
import { Provider, createClient, dedupExchange, fetchExchange } from "urql";
import { API_URL } from "../constants";
import theme from "../theme";
import { cacheExchange, QueryInput, Cache } from "@urql/exchange-graphcache";
import { LoginMutation, LogoutMutation, MeDocument, MeQuery } from "../generated/graphql";

function betterUpdateQuery<Result, Query>(
  cache: Cache,
  qi: QueryInput,
  result: any,
  fn: (r: Result, q: Query) => Query
) {
  return cache.updateQuery(qi, (data) => fn(result, data as any) as any);
}

const client = createClient({
  url: API_URL,
  fetchOptions: {
    credentials: "include",
  },
  exchanges: [
    dedupExchange,
    // Replace the default cacheExchange with the new one
    cacheExchange({
      updates: {
        Mutation: {
          login: (_result, args, cache, info) => {
            betterUpdateQuery<LoginMutation, MeQuery>(
              cache,
              { query: MeDocument },
              _result,
              (result, query) => {
                if (result.login.errors){
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
              () => ({me: null})
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
    fetchExchange,
  ],
});

function MyApp({ Component, pageProps }) {
  // console.log({ API_URL });
  return (
    <Provider value={client}>
      <ChakraProvider resetCSS theme={theme}>
        <ColorModeProvider
          options={{
            useSystemColorMode: true,
          }}
        >
          <Component {...pageProps} />
        </ColorModeProvider>
      </ChakraProvider>
    </Provider>
  );
}

export default MyApp;
