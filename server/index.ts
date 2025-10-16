import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { registerSocketHandlers } from "./socket/index";

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: { origin: "*" },
});

registerSocketHandlers(io);

app.get("/", (_req, res) => {
  res.send("Server is running 🚀");
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => console.log(`Listening on ${PORT}`));
