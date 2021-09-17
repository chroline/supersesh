import React, { useEffect, useRef } from "react";

import { Box, VStack } from "@chakra-ui/react";
import { useScroll } from "react-use";

import SessionDataService from "~/client/core/services/session-data";
import { ChatMessage } from "~/client/session-page/components/ChatMessage";
import { NoChatsDisplay } from "~/client/session-page/components/NoChatsDisplay";

export const ChatDisplay: React.FC = () => {
  const sessionData = SessionDataService.I.sessionData!;

  const chatListRef = useRef<HTMLDivElement>(),
    chatBoxRef = useRef<HTMLDivElement>(),
    bottomChatRef = useRef<HTMLDivElement>();

  const { y } = useScroll(chatBoxRef as any);
  const atBottom =
    Math.abs(
      (chatListRef.current?.getBoundingClientRect().height || 0) -
        ((chatBoxRef.current?.getBoundingClientRect().height || 0) + y)
    ) <
    (bottomChatRef.current?.getBoundingClientRect().height || 0) + 50;

  useEffect(() => {
    atBottom && chatBoxRef.current?.scrollTo({ top: chatListRef.current?.scrollHeight || 0 });
  }, [sessionData.chats.length]);

  return (
    <Box ref={chatBoxRef as any} w={"full"} flex={1} overflow={"scroll"}>
      <VStack ref={chatListRef as any} w={"full"} minH={"full"} p={6} spacing={4}>
        <Box flex={1} />
        {sessionData.chats.map((chat, i) => (
          <Box key={i} ref={i === sessionData.chats.length - 1 ? (bottomChatRef as any) : undefined} w={"full"}>
            <ChatMessage chat={chat} />
          </Box>
        ))}
        {sessionData.chats.length === 0 && <NoChatsDisplay />}
      </VStack>
    </Box>
  );
};
