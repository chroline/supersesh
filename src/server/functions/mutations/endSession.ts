import { Socket } from "socket.io";

import DatabaseService from "~/server/database/service";
import ServerEvents from "~/shared/types/ServerEvents";
import SocketIOAcknowledgementFn from "~/shared/types/SocketIOAcknowledgementFn";

const endSession = (socket: Socket) => async (sessionID: string, ack: SocketIOAcknowledgementFn) => {
  try {
    await DatabaseService.endSession(sessionID);
    socket.to(sessionID).emit(ServerEvents.END);
    ack();
  } catch (e) {
    ack(undefined, (e as Error).message);
  }
};

export default endSession;
