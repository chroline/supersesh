import { Socket } from "socket.io";

import DatabaseService from "~/server/database/service";
import ServerEvents from "~/shared/types/ServerEvents";
import SocketIOAcknowledgementFn from "~/shared/types/SocketIOAcknowledgementFn";

const joinSession =
  (socket: Socket, setSessionInfo: (sessionInfo: { sessionID: string; userID: string }) => void) =>
  async ({ sessionID, userID }: { sessionID: string; userID: string }, ack: SocketIOAcknowledgementFn) => {
    try {
      await DatabaseService.addUserToSession(sessionID, userID);
      socket.join(sessionID);
      socket.to(sessionID).emit(ServerEvents.USER_JOIN, userID);
      setSessionInfo({ sessionID, userID });
      ack();
    } catch (e) {
      ack(undefined, (e as Error).message);
    }
  };

export default joinSession;
