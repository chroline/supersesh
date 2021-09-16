import React, { useRef, useState } from "react";

import {
  Box,
  Divider,
  Drawer,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  HStack,
  Icon,
  IconButton,
  Stack,
  Text,
  useBreakpointValue,
  useColorMode,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { MenuRounded } from "@material-ui/icons";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";

import { PageTransition } from "~/client/core/components/PageTransition";
import { APIService } from "~/client/ctrl/api";
import { SessionDataService } from "~/client/ctrl/session-data";
import { ChatDisplay } from "~/client/session-page/components/ChatDisplay";
import { ChatForm } from "~/client/session-page/components/ChatForm";
import { Sidebar } from "~/client/session-page/components/Sidebar";
import { useHandleSessionPageRedirects } from "~/client/session-page/hooks/useHandleSessionPageRedirects";
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
  useHandleSessionPageRedirects(props, isJoined, sessionID);

  const toast = useToast({ position: "bottom-right" });
  APIService.setServerEventListener(SessionDataService.serverEventListener(toast, router));

  const { colorMode } = useColorMode();
  const showSidebar = useBreakpointValue({ base: false, md: true });

  const { isOpen: isDrawerOpen, onOpen: openDrawer, onClose: closeDrawer } = useDisclosure(),
    menuBtnRef = useRef();

  return (
    !props.error &&
    isJoined && (
      <PageTransition variant={"fade"}>
        <Head>
          <title>{sessionData ? `“${sessionData.name}” on` : "Loading... |"} SuperSesh!</title>
        </Head>
        <Stack direction={showSidebar ? "row" : "column"} h={"full"} spacing={0}>
          {showSidebar && (
            <Box h={"full"} w={72} position={"relative"} zIndex={2} shadow={"lg"}>
              <Sidebar />
            </Box>
          )}
          {!showSidebar && (
            <HStack p={3} spacing={3} w={"full"} position={"relative"} zIndex={2} shadow={"lg"} bg={"white"}>
              <IconButton aria-label={"menu"} icon={<Icon as={MenuRounded} />} onClick={openDrawer} />
              <Text isTruncated fontWeight={"semibold"}>
                {sessionData ? `“${sessionData.name}”` : "Loading.."}
              </Text>
            </HStack>
          )}
          <VStack
            flex={1}
            overflow={"hidden"}
            spacing={0}
            divider={<Divider borderColor={{ dark: "warmGray.700", light: "warmGray.200" }[colorMode]} />}
          >
            <ChatDisplay />
            <ChatForm />
          </VStack>
        </Stack>
        <Drawer
          placement={"left"}
          size={"xs"}
          isOpen={isDrawerOpen}
          onClose={closeDrawer}
          finalFocusRef={menuBtnRef as any}
        >
          <DrawerOverlay />
          <DrawerContent maxW={72}>
            <DrawerCloseButton />
            <Sidebar />
          </DrawerContent>
        </Drawer>
      </PageTransition>
    )
  );
}
