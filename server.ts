import moduleAlias from "module-alias";

import * as path from "path";

console.log("~", path.join(__dirname, process.env.NODE_ENV === "production" ? "dist" : "src"));

moduleAlias.addAlias("~", path.join(__dirname, process.env.NODE_ENV === "production" ? "dist" : "src"));

import("./src/server/main");
