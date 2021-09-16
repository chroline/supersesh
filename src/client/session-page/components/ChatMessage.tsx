import React from "react";

import { HStack, Icon, Text, useColorMode, VStack } from "@chakra-ui/react";
import { PersonRounded, VerifiedUserRounded } from "@material-ui/icons";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import theme from "~/client/core/styles/theme";
import { SessionDataService } from "~/client/ctrl/session-data";
import Chat from "~/shared/types/Chat";

dayjs.extend(relativeTime);

export const ChatMessage: React.FC<{ chat: Chat }> = ({ chat }) => {
  const { colorMode } = useColorMode();
  const isAdminColor = { dark: "emerald.300", light: "emerald.700" }[colorMode];
  const isUserColor = { dark: "blue.300", light: "blue.700" }[colorMode];

  const textColor =
    chat.userID === SessionDataService.getSessionData()!.adminID
      ? isAdminColor
      : chat.userID === localStorage.getItem("name")
      ? isUserColor
      : undefined;

  const icon = chat.userID === SessionDataService.getSessionData()!.adminID ? VerifiedUserRounded : PersonRounded;

  return (
    <VStack w={"full"} textAlign={"left"} spacing={1}>
      <HStack w={"full"} spacing={3}>
        <Icon as={icon} style={{ fontSize: theme.sizes[5] }} color={textColor} />
        <Text fontSize={"md"} fontWeight={"medium"} color={textColor} w={"full"} isTruncated>
          {chat.userID}
        </Text>
        <Text fontSize={"md"} opacity={0.8} flexShrink={0}>
          {dayjs(chat.date).fromNow()}
        </Text>
      </HStack>
      <Text w={"full"} pl={3}>
        {chat.msg}
      </Text>
    </VStack>
  );
};
