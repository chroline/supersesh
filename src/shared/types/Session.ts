import Chat from "./Chat";

export default interface Session {
  name: string;
  adminID: string;
  userIDs: string[];
  chats: Chat[];
}
