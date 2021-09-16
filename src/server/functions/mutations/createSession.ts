import { Socket } from "socket.io";

import DatabaseService from "~/server/database/service";
import Session from "~/shared/types/Session";
import SocketIOAcknowledgementFn from "~/shared/types/SocketIOAcknowledgementFn";

const createSession =
  (socket: Socket, setSessionInfo: (sessionInfo: { sessionID: string; userID: string }) => void) =>
  async (session: Session, ack: SocketIOAcknowledgementFn<{ sessionID: string }>) => {
    try {
      const sessionID = await DatabaseService.createNewSession(session);
      socket.join(sessionID);
      setSessionInfo({ sessionID, userID: session.adminID });
      ack({ sessionID });
    } catch (e) {
      ack(undefined, (e as Error).message);
    }
  };

export default createSession;
