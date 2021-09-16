import React from "react";

import { Icon, Text, VStack } from "@chakra-ui/react";
import { QuestionAnswerRounded } from "@material-ui/icons";

import theme from "~/client/core/styles/theme";

export const NoChatsDisplay = () => (
  <VStack maxW={"md"} w={"full"} textAlign={"center"} opacity={0.8}>
    <Icon as={QuestionAnswerRounded} style={{ fontSize: theme.sizes["12"] }} />
    <Text fontSize={"3xl"} fontWeight={"semibold"}>
      send a chat!
    </Text>
    <Text fontSize={"base"}>
      communicate with other members in the group by sending chats to one another. try it out below!
    </Text>
  </VStack>
);
