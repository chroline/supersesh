import React, { KeyboardEvent, useState } from "react";

import { Flex, HStack, Icon, IconButton, Textarea, useToast } from "@chakra-ui/react";
import { SendRounded } from "@material-ui/icons";
import { useRouter } from "next/router";
import TextareaAutosize from "react-autosize-textarea";

import APIService from "~/client/core/services/api";
import SessionDataService from "~/client/core/services/session-data";
import isMobile from "~/client/session-page/util/isMobile";

export const ChatForm: React.FC = () => {
  const sessionID = useRouter().query.sessionID as string;

  const [value, setValue] = useState<string>("");

  const toast = useToast({ position: "bottom-right" });

  async function submit() {
    setValue("");

    if (value == "" || !/\S/.test(value)) return;

    !isMobile() && new Audio("/sfx/chat_send.m4a").play();
    try {
      const chat = {
        date: new Date(),
        userID: localStorage.getItem("name") as string,
        msg: value,
      };
      await APIService.I.sendChat(sessionID, chat);
      SessionDataService.I.addChat(chat);
    } catch (e) {
      toast({
        title: "An error occurred",
        description: (e as Error).message,
        status: "error",
        variant: "solid",
        duration: 9000,
        isClosable: true,
      });
    }
  }

  function editForm(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (!e.shiftKey && e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();
      submit();
    }
  }

  return (
    <HStack w={"full"} p={6} align={"flex-end"}>
      <Flex minH={"full"} w={"full"} align={"center"}>
        <Textarea
          as={TextareaAutosize}
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyPressCapture={editForm}
          placeholder={"send a chat"}
          inputMode={"text"}
          // @ts-ignore
          enterKeyHint={"send"}
          rows={1}
          w={"full"}
          variant={"unstyled"}
          fontSize={"lg"}
          py={0}
          px={3}
        />
      </Flex>
      <IconButton aria-label={"send"} icon={<Icon as={SendRounded} />} onClick={submit} colorScheme={"indigo"} />
    </HStack>
  );
};
