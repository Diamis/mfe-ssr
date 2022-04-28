process.env.NODE_ENV = "development";
process.env.APP_NAME = "test_host";

import server from "mfe-ssr";

server({ port: 3000 });
