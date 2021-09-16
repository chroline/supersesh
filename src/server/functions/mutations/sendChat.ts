import { Socket } from "socket.io";

import DatabaseService from "~/server/database/service";
import Chat from "~/shared/types/Chat";
import ServerEvents from "~/shared/types/ServerEvents";
import SocketIOAcknowledgementFn from "~/shared/types/SocketIOAcknowledgementFn";

const sendChat =
  (socket: Socket) =>
  async ({ sessionID, chat }: { sessionID: string; chat: Chat }, ack: SocketIOAcknowledgementFn) => {
    try {
      await DatabaseService.addChatToSession(sessionID, chat);
      socket.to(sessionID).emit(ServerEvents.CHAT, chat);
      ack();
    } catch (e) {
      ack(undefined, (e as Error).message);
    }
  };

export default sendChat;
