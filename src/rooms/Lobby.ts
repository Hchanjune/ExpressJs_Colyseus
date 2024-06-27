import { Room, Client, matchMaker } from "colyseus";
import { LobbyState } from "../schemas/LobbyState";
import { Player } from "../schemas/Player";

export class Lobby extends Room<LobbyState> {
    onCreate(options: any) {
        this.setState(new LobbyState());
        console.log(`${this.roomName} Successfully Created`);

        this.onMessage("create_chat_room", async (client, message) => {
            console.log("Received create_chat_room message:", message);
            const chatRoomId = `${client.sessionId}_chat_room_${Date.now()}`;
            try {
                console.log("Attempting to create chat room with ID:", chatRoomId);
                const chatRoom = await matchMaker.createRoom("ChatRoom", { roomName: chatRoomId });
                console.log("Chat room created with ID:", chatRoom.roomId);
                client.send("chat_room_created", { chatRoomId: chatRoom.roomId });
            } catch (e) {
                console.error("Error creating chat room:", e);
                client.send("error", { message: "Failed to create chat room" });
            }
        });
    }

    onJoin(client: Client, options: any) {
        const playerId = options.id;

        // 동일한 ID가 이미 존재하는지 확인
        for (const [sessionId, player] of this.state.players.entries()) {
            if (player.id === playerId) {
                console.log(`Client with ID ${playerId} already connected. Kicking new connection.`);
                client.leave();
                return;
            }
        }

        const player = new Player();
        player.id = playerId;
        player.name = "Player " + this.clients.length;
        this.state.players.set(client.sessionId, player);
        console.log(`Client joined: ${player.id}`);
        // 클라이언트가 방에 조인할 때의 로직
    }

    onLeave(client: Client, consented: boolean) {
        const player = this.state.players.get(client.sessionId);
        if (player) {
            console.log(`Client left: ${player.id}`);
            this.state.players.delete(client.sessionId);
        } else {
            console.log(`Client left: ${client.sessionId}`);
        }
        // 클라이언트가 방을 떠날 때의 로직
    }

    onDispose() {
        console.log(`Dispose ${this.roomName}`);
        // 방이 삭제될 때의 로직
    }
}
