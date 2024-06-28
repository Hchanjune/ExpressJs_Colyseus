import { Room, Client } from "colyseus";
import { ChatRoomState } from "../schemas/ChatRoomState";
import { Player } from "../schemas/Player";

export class ChatRoom extends Room<ChatRoomState> {
    constructor() {
        super();
        this.setState(new ChatRoomState());
    }

    onCreate(options: any) {
        console.log(`Chat room ${options.roomName} created.`);
        this.state.roomName = options.roomName;
        this.state.roomOwner = options.roomOwner;

        this.autoDispose = true;

        // Log state initialization
        console.log(`[${this.state.roomName}] Initial Room Name: ${this.state.roomName}`);
        console.log(`[${this.state.roomName}] Initial Room Owner: ${this.state.roomOwner}`);
    }

    onJoin(client: Client, options: any) {
        const playerId = options.id;

        for (const [sessionId, player] of this.state.players.entries()) {
            if (player.id === playerId) {
                console.log(`[${this.state.roomName}] Client with ID ${playerId} already connected. Kicking new connection.`);
                client.leave();
                return;
            }
        }

        const player = new Player();
        player.id = playerId;
        player.name = "Player " + this.clients.length;
        this.state.players.set(client.sessionId, player);

        console.log(`[${player.id}] joined To Chat Room Name [${this.state.roomName}] Owner [${this.state.roomOwner}]`);
        console.log(`[${this.state.roomName}] Current players:`, Array.from(this.state.players.values()).map(p => p.id));
    }

    onLeave(client: Client, consented: boolean) {
        const player = this.state.players.get(client.sessionId);
        if (player) {
            console.log(`[${this.state.roomName}] Client left: ${player.id}`);
            this.state.players.delete(client.sessionId);
        } else {
            console.log(`[${this.state.roomName}] Client left: ${client.sessionId}`);
        }

        console.log(`[${this.state.roomName}] Remaining players:`, Array.from(this.state.players.values()).map(p => p.id));
    }

    // onDispose
}
