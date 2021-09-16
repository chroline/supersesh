import { nanoid } from "nanoid";

import { DatabaseStore } from "~/server/database/store";
import APIErrors from "~/shared/types/APIErrors";
import Chat from "~/shared/types/Chat";
import Session from "~/shared/types/Session";

namespace DatabaseService {
  let _databaseStore: DatabaseStore;

  export function setDatabaseStore(databaseStore: DatabaseStore) {
    _databaseStore = databaseStore;
  }

  export async function createNewSession(session: Session): Promise<string> {
    const sessionID = nanoid(8);
    await _databaseStore.updateSession(sessionID, session);
    return sessionID;
  }

  export async function getSession(sessionID: string): Promise<Session | undefined> {
    return await _databaseStore.getSession(sessionID);
  }

  export async function getSessions() {
    return await _databaseStore.getActiveSessions();
  }

  export async function addUserToSession(sessionID: string, userID: string): Promise<void> {
    const session = await _databaseStore.getSession(sessionID);

    if (!session) throw new Error(APIErrors.SESSION_NOT_FOUND);
    if (session.userIDs.includes(userID) || session.adminID == userID) throw new Error(APIErrors.USER_ID_TAKEN);

    session.userIDs.push(userID);
    await _databaseStore.updateSession(sessionID, session);
  }

  export async function removeUserFromSession(sessionID: string, userID: string): Promise<void> {
    const session = await _databaseStore.getSession(sessionID);

    if (!session) throw new Error(APIErrors.SESSION_NOT_FOUND);

    const userIDs = new Set(session.userIDs);
    userIDs.delete(userID);
    session.userIDs = Array.from(userIDs);
    await _databaseStore.updateSession(sessionID, session);
  }

  export async function addChatToSession(sessionID: string, chat: Chat): Promise<void> {
    const session = await _databaseStore.getSession(sessionID);

    if (!session) throw new Error(APIErrors.SESSION_NOT_FOUND);

    session.chats.push(chat);
    await _databaseStore.updateSession(sessionID, session);
  }

  export async function endSession(sessionID: string) {
    await _databaseStore.deleteSession(sessionID);
  }
}

export default DatabaseService;
