import { Room, Client } from "colyseus";
import { ChatRoomState } from "../schemas/ChatRoomState";
import { Player } from "../schemas/Player";

export class ChatRoom extends Room<ChatRoomState> {
    onCreate(options: any) {
        this.setState(new ChatRoomState());
        console.log(`Chat room ${options.roomName} created.`);
    }

    onJoin(client: Client, options: any) {
        console.log(`Client joined chat room: ${client.sessionId}`);
        const player = new Player();
        player.id = options.id;
        this.state.players.set(client.sessionId, player);
    }

    onLeave(client: Client, consented: boolean) {
        this.state.players.delete(client.sessionId);
        console.log(`Client left chat room: ${client.sessionId}`);
    }
}
