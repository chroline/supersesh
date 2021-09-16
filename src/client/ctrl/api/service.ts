import { io, Socket } from "socket.io-client";

import APIEndpoints from "~/shared/types/APIEndpoints";
import Chat from "~/shared/types/Chat";
import ClientEvents from "~/shared/types/ClientEvents";
import ServerEvents from "~/shared/types/ServerEvents";
import Session from "~/shared/types/Session";
import SocketIOAcknowledgementFn from "~/shared/types/SocketIOAcknowledgementFn";

const BASE_URL = process.env.NODE_ENV === "production" ? "https://supersesh.herokuapp.com" : "http://localhost:3000";

export namespace APIService {
  let _socket: Socket;

  let _serverEventListeners: ((event: ServerEvents, data: any) => void) | undefined;

  export function initConnection() {
    _socket = io();

    _socket.onAny((event: ServerEvents, data: any) => _serverEventListeners?.(event, data));
  }

  export function setServerEventListener(fn?: (event: ServerEvents, data: any) => void) {
    _serverEventListeners = fn;
  }

  export function createSession(session: Session): Promise<string> {
    return new Promise((resolve, reject) =>
      _socket.emit(ClientEvents.CREATE_SESSION, session, ((value, error) => {
        if (!error) resolve(value!.sessionID);
        else reject(new Error(error));
      }) as SocketIOAcknowledgementFn<{ sessionID: string }>)
    );
  }

  export function joinSession(sessionID: string, userID: string): Promise<void> {
    return new Promise((resolve, reject) =>
      _socket.emit(ClientEvents.JOIN_SESSION, { sessionID, userID }, ((_, error) => {
        if (!error) resolve();
        else reject(new Error(error));
      }) as SocketIOAcknowledgementFn)
    );
  }

  export async function getSessionData(sessionID: string): Promise<Session> {
    const res = await fetch(`${BASE_URL}/api/${APIEndpoints.GET_SESSION_DATA}?sessionID=${sessionID}`).then(
      async res => {
        if (!res.ok) {
          throw new Error((await res.json()).error);
        } else return res;
      }
    );
    return res.json();
  }

  export async function sendChat(sessionID: string, chat: Chat): Promise<void> {
    return new Promise((resolve, reject) =>
      _socket.emit(ClientEvents.CHAT, { sessionID, chat }, ((_, error) => {
        if (!error) resolve();
        else reject(new Error(error));
      }) as SocketIOAcknowledgementFn)
    );
  }

  export async function endSession(sessionID: string): Promise<void> {
    return new Promise((resolve, reject) =>
      _socket.emit(ClientEvents.END, sessionID, ((_, error) => {
        if (!error) resolve();
        else reject(new Error(error));
      }) as SocketIOAcknowledgementFn)
    );
  }
}
