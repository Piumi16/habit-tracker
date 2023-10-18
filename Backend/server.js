const app = require("./app");
const http = require("http");

const port = (process.env.PORT || "3000");

const server = http.createServer(app);
server.on("error", () => console.log('Server Error'));
server.on("listening", () => console.log('Server Listening'));
server.listen(port);
