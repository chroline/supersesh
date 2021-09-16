import React, { useState } from "react";

import { Box, Divider, HStack, useBreakpointValue, useColorMode, useToast, VStack } from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";

import { PageTransition } from "~/client/core/components/PageTransition";
import { APIService } from "~/client/ctrl/api";
import { SessionDataService } from "~/client/ctrl/session-data";
import { ChatDisplay } from "~/client/session-page/components/ChatDisplay";
import { ChatForm } from "~/client/session-page/components/ChatForm";
import { Sidebar } from "~/client/session-page/components/Sidebar";
import useHandleSessionPageError from "~/client/session-page/hooks/useHandleSessionPageError";
import SessionPageProps from "~/client/session-page/util/SessionPageProps";
import Session from "~/shared/types/Session";

export const getServerSideProps: GetServerSideProps<SessionPageProps> = async context => {
  const sessionID = context.params?.sessionID as string;

  let sessionData: Session;

  try {
    sessionData = await APIService.getSessionData(sessionID);
  } catch (e) {
    return { props: { value: null, error: (e as Error).message } };
  }

  return {
    props: { value: { session: sessionData }, error: null },
  };
};

export default function SessionPage(props: SessionPageProps) {
  const router = useRouter(),
    sessionID = router.query.sessionID as string;

  const [sessionData, setSessionData] = useState<Session | undefined>(
    SessionDataService.getSessionData() || {
      adminID: props.value?.session.adminID || "",
      chats: [],
      userIDs: [],
      name: props.value?.session.name || "",
    }
  );
  SessionDataService.setSessionDataState([sessionData, setSessionData]);

  const userID = process.browser ? localStorage.getItem("name") || "" : "",
    isJoined = props.value?.session.userIDs.includes(userID) || props.value?.session.adminID === userID;

  // handle potential errors that result in redirects
  useHandleSessionPageError(props, isJoined, sessionID);

  const toast = useToast({ position: "bottom-right" });
  APIService.setServerEventListener(SessionDataService.serverEventListener(toast, router));

  const { colorMode } = useColorMode();
  const showSidebar = useBreakpointValue({ base: false, md: true });

  return (
    !props.error &&
    isJoined && (
      <PageTransition variant={"fade"}>
        <Head>
          <title>{sessionData ? `“${sessionData.name}” on` : "Loading... |"} SuperSesh!</title>
        </Head>
        <HStack h={"full"} spacing={0}>
          {showSidebar && (
            <Box h={"full"} position={"relative"} zIndex={2} shadow={"lg"}>
              <Sidebar />
            </Box>
          )}
          <VStack
            w={"full"}
            h={"full"}
            spacing={0}
            divider={<Divider borderColor={{ dark: "warmGray.700", light: "warmGray.200" }[colorMode]} />}
          >
            <ChatDisplay />
            <ChatForm />
          </VStack>
        </HStack>
      </PageTransition>
    )
  );
}
