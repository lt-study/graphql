import { ChakraProvider, ColorModeProvider } from "@chakra-ui/react";
import { Provider, createClient, useMutation } from "urql";
import { API_URL } from "../constants";
import theme from "../theme";

function MyApp({ Component, pageProps }) {
  console.log({ API_URL });
  const client = createClient({
    url: API_URL,
    fetchOptions: {
      credentials: "include",
    },
  });
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
