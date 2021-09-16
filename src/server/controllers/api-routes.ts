import { Request, Response } from "express";

import getSessionData from "~/server/functions/queries/getSessionData";
import APIEndpoints from "~/shared/types/APIEndpoints";
import APIErrors from "~/shared/types/APIErrors";

export default async function apiRoutesHandler(req: Request, res: Response) {
  try {
    const endpoint = req.path.split("/api/")[1] as APIEndpoints;

    if (endpoint === APIEndpoints.GET_SESSION_DATA) {
      const session = await getSessionData(req.query.sessionID as string);
      if (session) return res.json(session);
      else res.status(400).send({ error: APIErrors.SESSION_NOT_FOUND });
    }
  } catch (e) {
    console.error(e);
    return res.sendStatus(500).send();
  }
}
