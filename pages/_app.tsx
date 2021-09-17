import React from "react";

import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { AnimatePresence } from "framer-motion";
import { AppProps } from "next/app";
import Router from "next/router";
import NProgress from "nprogress";
import { useAsync } from "react-use";

import "~/client/core/assets/fonts/Calibre/stylesheet.scss";
import APIService from "~/client/core/services/api";
import "~/client/core/styles/nprogress.scss";
import theme from "~/client/core/styles/theme";

Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

function MyApp({ Component, pageProps, router }: AppProps) {
  const { loading } = useAsync(async () => {
    // initialize socket.io API connection
    APIService.I.initConnection();
  }, []);

  return (
    <ChakraProvider resetCSS theme={extendTheme(theme)}>
      <AnimatePresence exitBeforeEnter initial={false} onExitComplete={() => window.scrollTo(0, 0)}>
        {!loading && <Component {...pageProps} key={router.route || "/"} />}
      </AnimatePresence>
    </ChakraProvider>
  );
}

export default MyApp;
