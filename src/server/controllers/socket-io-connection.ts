import * as socketio from "socket.io";
import { Server } from "socket.io";

import DatabaseService from "~/server/database/service";
import createSession from "~/server/functions/mutations/createSession";
import endSession from "~/server/functions/mutations/endSession";
import joinSession from "~/server/functions/mutations/joinSession";
import sendChat from "~/server/functions/mutations/sendChat";
import ClientEvents from "~/shared/types/ClientEvents";
import ServerEvents from "~/shared/types/ServerEvents";

/**
 * Handle live socket.io mutation requestions.
 *
 * The socket.io channel is only used for mutation (create, update, and delete) requests.
 *
 * There are 3 current available operations:
 * 1. {@link ClientEvents.CREATE_SESSION}: add provided session data to database
 * 2. {@link ClientEvents.JOIN_SESSION}: notify database of a user being added to session
 * 3. {@link ClientEvents.CHAT}: add chat to session
 * 4. {@link ClientEvents.END}: delete session from database and notify users
 */
const socketIOConnection = (io: Server) => (socket: socketio.Socket) => {
  let _sessionInfo: { sessionID: string; userID: string } | null = null;

  socket.on(
    ClientEvents.CREATE_SESSION,
    createSession(socket, sessionInfo => (_sessionInfo = sessionInfo))
  );
  socket.on(
    ClientEvents.JOIN_SESSION,
    joinSession(socket, sessionInfo => (_sessionInfo = sessionInfo))
  );
  socket.on(ClientEvents.CHAT, sendChat(socket));
  socket.on(ClientEvents.END, endSession(socket));

  socket.on("disconnect", async () => {
    if (_sessionInfo) {
      if (_sessionInfo.userID === (await DatabaseService.getSession(_sessionInfo.sessionID))?.adminID) {
        io.to(_sessionInfo.sessionID).emit(ServerEvents.END);
      } else {
        io.to(_sessionInfo.sessionID).emit(ServerEvents.USER_LEAVE, _sessionInfo.userID);
        await DatabaseService.removeUserFromSession(_sessionInfo.sessionID, _sessionInfo.userID);
      }
    }
  });
};

export default socketIOConnection;
