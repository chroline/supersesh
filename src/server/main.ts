import express, { Express } from "express";
import * as http from "http";
import next from "next";
import * as socketio from "socket.io";

import apiRoutesHandler from "~/server/controllers/api-routes";
import socketIOConnection from "~/server/controllers/socket-io-connection";
import DatabaseService from "~/server/database/service";
import DatabaseStoreImpl from "~/server/database/store";

const port = parseInt(process.env.PORT || "3000", 10);
const nextApp = next({ dev: process.env.NODE_ENV !== "production" });
const nextHandler = nextApp.getRequestHandler();

nextApp
  .prepare()
  .then(async () => {
    console.log("hey");
    // initialize database
    const databaseStore = new DatabaseStoreImpl();
    DatabaseService.setDatabaseStore(databaseStore);

    const app: Express = express();
    const server: http.Server = http.createServer(app);
    const io: socketio.Server = new socketio.Server();
    io.attach(server);

    // redirect http to https
    app.use((req, res, next) => {
      console.log("hey!!!");
      if (process.env.NODE_ENV === "production") {
        if (req.headers["x-forwarded-proto"] !== "https") return res.redirect("https://" + req.headers.host + req.url);
        else return next();
      } else return next();
    });

    app.get("/api/*", apiRoutesHandler);

    io.on("connection", socketIOConnection(io));

    app.all("*", nextHandler as any);

    server.listen(port, () => console.log(`> Ready on http://localhost:${port}`));
  })
  .catch(e => {
    console.error(e);
  });
