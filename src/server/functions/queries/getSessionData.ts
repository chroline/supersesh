import DatabaseService from "~/server/database/service";

export default async function getSessionData(sessionID: string) {
  return await DatabaseService.getSession(sessionID);
}
