import { useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";

import APIService from "~/client/core/services/api";
import Chat from "~/shared/types/Chat";
import ServerEvents from "~/shared/types/ServerEvents";
import Session from "~/shared/types/Session";

/**
 * Service for managing session data.
 */
export default class SessionDataService {
  public static I: SessionDataService = new SessionDataService();

  private _sessionDataSetter!: (session: Session) => void;
  private _sessionData?: Session;

  /**
   * Retrieve session data.
   */
  get sessionData() {
    return this._sessionData!;
  }

  /**
   * Call session data setter.
   *
   * @param session
   */
  set sessionData(session: Session) {
    this._sessionDataSetter(session);
  }

  /**
   * Assign getter and setter for managing session data state.
   *
   * @param state
   */
  set sessionDataState(state: [Session | undefined, (session: Session) => void]) {
    this._sessionData = state[0];
    this._sessionDataSetter = state[1];
  }

  /**
   * Add chat (send from current user) to session data.
   *
   * @param chat
   */
  addChat(chat: Chat) {
    this.sessionData = { ...this._sessionData!, chats: [...this._sessionData!.chats, chat] };
  }

  /**
   * Create a new server event listener function for use in {@link APIService.setServerEventListener}.
   *
   * @param toast
   * @param router
   */
  serverEventListener =
    (toast: ReturnType<typeof useToast>, router: ReturnType<typeof useRouter>) => (event: ServerEvents, data: any) => {
      switch (event) {
        case ServerEvents.USER_JOIN:
          this.sessionData = { ...this._sessionData!, userIDs: [...this._sessionData!.userIDs, data] };

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
          const userIDs = new Set(this._sessionData!.userIDs);
          userIDs.delete(data);
          this.sessionData = { ...this._sessionData!, userIDs: Array.from(userIDs) };

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
          this.sessionData = { ...this._sessionData!, chats: [...this._sessionData!.chats, data] };

          new Audio("/sfx/chat_receive.m4a").play();
          return;
        case ServerEvents.END:
          APIService.I.serverEventListener = undefined;
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
