import express from "express";
import path from "path";
import { createServer } from "http";
import { Server} from "colyseus";
import { WebSocketTransport } from "@colyseus/ws-transport";
import { Lobby } from "./src/rooms/Lobby";
import {ChatRoom} from "./src/rooms/ChatRoom";

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 정적 파일 제공
app.use(express.static(path.join(__dirname, 'public')));

// HTTP 서버 생성
const httpServer = createServer(app);

// Colyseus 서버 설정
const server = new Server({
    transport: new WebSocketTransport({
        server: httpServer,
        pingInterval: 1000,
        pingMaxRetries: 3
    })
});

server.define("Lobby", Lobby);
server.define("ChatRoom", ChatRoom);

httpServer.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
