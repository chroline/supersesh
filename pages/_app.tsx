import React, { useEffect } from "react";

import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { AnimatePresence } from "framer-motion";
import { AppProps } from "next/app";
import Router from "next/router";
import NProgress from "nprogress";

import "~/client/core/assets/fonts/Calibre/stylesheet.scss";
import "~/client/core/styles/main.scss";
import "~/client/core/styles/nprogress.scss";
import theme from "~/client/core/util/theme";
import { APIService } from "~/client/ctrl/api";

Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

function MyApp({ Component, pageProps, router }: AppProps) {
  // initialize API socket.io connection
  useEffect(() => {
    APIService.initConnection();
  }, []);

  return (
    <ChakraProvider resetCSS theme={extendTheme(theme)}>
      <AnimatePresence exitBeforeEnter initial={false} onExitComplete={() => window.scrollTo(0, 0)}>
        <Component {...pageProps} key={router.route || "/"} />
      </AnimatePresence>
    </ChakraProvider>
  );
}

export default MyApp;
