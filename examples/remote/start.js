process.env.NODE_ENV = "development";
process.env.APP_NAME = "test_remote";

import server from "mfe-ssr";

server({ port: 3002 });
