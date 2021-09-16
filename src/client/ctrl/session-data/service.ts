import { useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";

import { APIService } from "~/client/ctrl/api";
import Chat from "~/shared/types/Chat";
import ServerEvents from "~/shared/types/ServerEvents";
import Session from "~/shared/types/Session";

/**
 * Service for managing session data.
 */
export namespace SessionDataService {
  let _sessionData: Session | undefined;
  let _sessionDataSetter: (session: Session) => void;

  /**
   * Assign getter and setter for managing session data state.
   *
   * @param state
   * @param fn
   */
  export function setSessionDataState([state, fn]: [Session | undefined, (session: Session) => void]) {
    _sessionData = state;
    _sessionDataSetter = fn;
  }

  /**
   * Retrieve session data.
   */
  export function getSessionData() {
    return _sessionData;
  }

  /**
   * Call session data setter.
   *
   * @param session
   */
  export function setSessionData(session: Session) {
    _sessionDataSetter(session);
  }

  /**
   * Add chat (send from current user) to session data.
   *
   * @param chat
   */
  export function addChat(chat: Chat) {
    setSessionData({ ..._sessionData!, chats: [..._sessionData!.chats, chat] });
  }

  /**
   * Create a new server event listener function for use in {@link APIService.setServerEventListener}.
   *
   * @param toast
   * @param router
   */
  export const serverEventListener =
    (toast: ReturnType<typeof useToast>, router: ReturnType<typeof useRouter>) => (event: ServerEvents, data: any) => {
      switch (event) {
        case ServerEvents.USER_JOIN:
          setSessionData({ ..._sessionData!, userIDs: [..._sessionData!.userIDs, data] });

          toast({
            title: data + " joined!",
            status: "info",
            variant: "solid",
            duration: 9000,
            isClosable: true,
          });
          new Audio("/sfx/user_join.m4a").play();
          return;
        case ServerEvents.USER_LEAVE:
          const userIDs = new Set(_sessionData!.userIDs);
          userIDs.delete(data);
          setSessionData({ ..._sessionData!, userIDs: Array.from(userIDs) });

          toast({
            title: data + " left.",
            status: "info",
            variant: "solid",
            duration: 9000,
            isClosable: true,
          });
          new Audio("/sfx/user_leave.m4a").play();
          return;
        case ServerEvents.CHAT:
          setSessionData({ ..._sessionData!, chats: [..._sessionData!.chats, data] });

          new Audio("/sfx/chat_receive.m4a").play();
          return;
        case ServerEvents.END:
          APIService.setServerEventListener(undefined);
          router.push("/");

          toast({
            title: "Session ended.",
            status: "info",
            variant: "solid",
            duration: 9000,
            isClosable: true,
          });
          return;
      }
    };
}
