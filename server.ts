import moduleAlias from "module-alias";
import * as path from "path";

moduleAlias.addAlias("~", path.join(__dirname, "src"));

import("./src/server/main");
