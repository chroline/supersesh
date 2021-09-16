import React, { KeyboardEvent, useState } from "react";

import { Box, Textarea, useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";
import TextareaAutosize from "react-autosize-textarea";

import { APIService } from "~/client/ctrl/api";
import { SessionDataService } from "~/client/ctrl/session-data";

export const ChatForm: React.FC<{}> = () => {
  const sessionID = useRouter().query.sessionID as string;

  const [value, setValue] = useState<string>("");

  const toast = useToast({ position: "bottom-right" });

  async function editForm(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (!e.shiftKey && e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();
      setValue("");

      if (value == "" || !/\S/.test(value)) return;

      new Audio("/sfx/chat_send.m4a").play();
      try {
        const chat = {
          date: new Date(),
          userID: localStorage.getItem("name") as string,
          msg: value,
        };
        await APIService.sendChat(sessionID, chat);
        SessionDataService.addChat(chat);
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
  }

  return (
    <Box w={"full"}>
      <Textarea
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyPressCapture={editForm}
        placeholder={"send a chat"}
        as={TextareaAutosize}
        rows={1}
        w={"full"}
        variant={"unstyled"}
        fontSize={"lg"}
        py={6}
        px={9}
      />
    </Box>
  );
};
