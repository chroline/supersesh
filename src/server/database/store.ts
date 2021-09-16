import Session from "~/shared/types/Session";

/**
 * CRUD interface for database
 */
export abstract class DatabaseStore {
  public abstract getSession(sessionID: string): Promise<Session>;

  public abstract updateSession(sessionID: string, session: Session): Promise<void>;

  public abstract deleteSession(sessionID: string): Promise<void>;
}

/**
 * Default implementation of DatabaseStore
 *
 * @summary Implements database as a native JS object. Simulates asynchronous database requests by returning values as Promises.
 */
export default class DatabaseStoreImpl extends DatabaseStore {
  private _activeRooms: Record<string, Session> = {};

  async getSession(sessionID: string): Promise<Session> {
    return Promise.resolve(this._activeRooms[sessionID]);
  }

  async updateSession(sessionID: string, session: Session): Promise<void> {
    this._activeRooms[sessionID] = session;
  }

  async deleteSession(sessionID: string): Promise<void> {
    delete this._activeRooms[sessionID];
  }
}
