import { Socket } from "socket.io";

import SocketIOAcknowledgementFn from "~/shared/types/SocketIOAcknowledgementFn";

const rejoinSession =
  (socket: Socket, setSessionInfo: (sessionInfo: { sessionID: string; userID: string }) => void) =>
  async ({ sessionID, userID }: { sessionID: string; userID: string }, ack: SocketIOAcknowledgementFn) => {
    try {
      socket.join(sessionID);
      setSessionInfo({ sessionID, userID });
      ack();
    } catch (e) {
      ack(undefined, (e as Error).message);
    }
  };

export default rejoinSession;
