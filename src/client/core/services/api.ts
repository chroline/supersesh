import { io, Socket } from "socket.io-client";

import APIEndpoints from "~/shared/types/APIEndpoints";
import Chat from "~/shared/types/Chat";
import ClientEvents from "~/shared/types/ClientEvents";
import ServerEvents from "~/shared/types/ServerEvents";
import Session from "~/shared/types/Session";
import SocketIOAcknowledgementFn from "~/shared/types/SocketIOAcknowledgementFn";

const BASE_URL =
  process.env.NODE_ENV === "production" ? "https://supersesh.herokuapp.com" : "http://192.168.86.99:3000";

/**
 * Service for making requests (mutations & queries) to API.
 *
 * Mutation requests are made thru the socket.io channel; query requests are made thru HTTP GET requests.
 */
export default class APIService {
  public static I: APIService = new APIService();

  private _socket!: Socket;
  private _serverEventListeners: ((event: ServerEvents, data: any) => void) | undefined;

  /**
   * Assign a listener function that listens to server events.
   *
   * @param fn - server event listener function
   */
  set serverEventListener(fn: ((event: ServerEvents, data: any) => void) | undefined) {
    this._serverEventListeners = fn;
  }

  /**
   * Initialize socket.io connection.
   */
  initConnection() {
    this._socket = io();
    this._socket.onAny((event: ServerEvents, data: any) => this._serverEventListeners?.(event, data));
  }

  createSession(session: Session): Promise<string> {
    return new Promise((resolve, reject) =>
      this._socket.emit(ClientEvents.CREATE_SESSION, session, ((value, error) => {
        if (!error) resolve(value!.sessionID);
        else reject(new Error(error));
      }) as SocketIOAcknowledgementFn<{ sessionID: string }>)
    );
  }

  joinSession(sessionID: string, userID: string): Promise<void> {
    return new Promise((resolve, reject) =>
      this._socket.emit(ClientEvents.JOIN_SESSION, { sessionID, userID }, ((_, error) => {
        if (!error) resolve();
        else reject(new Error(error));
      }) as SocketIOAcknowledgementFn)
    );
  }

  rejoinSession(sessionID: string, userID: string): Promise<void> {
    return new Promise((resolve, reject) =>
      this._socket.emit(ClientEvents.ADMIN_REJOIN_SESSION, { sessionID, userID }, ((_, error) => {
        if (!error) resolve();
        else reject(new Error(error));
      }) as SocketIOAcknowledgementFn)
    );
  }

  async getSessionData(sessionID: string): Promise<Session> {
    const res = await fetch(`${BASE_URL}/api/${APIEndpoints.GET_SESSION_DATA}?sessionID=${sessionID}`).then(
      async res => {
        if (!res.ok) {
          throw new Error((await res.json()).error);
        } else return res;
      }
    );
    return res.json();
  }

  async sendChat(sessionID: string, chat: Chat): Promise<void> {
    return new Promise((resolve, reject) =>
      this._socket.emit(ClientEvents.CHAT, { sessionID, chat }, ((_, error) => {
        if (!error) resolve();
        else reject(new Error(error));
      }) as SocketIOAcknowledgementFn)
    );
  }

  async endSession(sessionID: string): Promise<void> {
    return new Promise((resolve, reject) =>
      this._socket.emit(ClientEvents.END, sessionID, ((_, error) => {
        if (!error) resolve();
        else reject(new Error(error));
      }) as SocketIOAcknowledgementFn)
    );
  }
}
