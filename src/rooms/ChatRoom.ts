import {Room, Client, matchMaker, RoomListingData} from "colyseus";
import { ChatRoomState } from "../schemas/ChatRoomState";
import { Player } from "../schemas/Player";
import {Lobby} from "./Lobby";
import {ChatRoomCommands, ChatRoomController} from "../controllers/ChatRoomController";


export class ChatRoom extends Room<ChatRoomState> {

    private chatRoomController: ChatRoomController
    constructor() {
        super();
        this.setState(new ChatRoomState());
        this.chatRoomController = new ChatRoomController(this.state);
    }

    onCreate(options: any) {
        console.log(`Chat room ${options.roomName} created.`);
        this.state.roomName = options.roomName;
        this.state.roomOwner = options.roomOwner;

        this.autoDispose = true;

        // Log state initialization
        console.log(`[${this.state.roomName}] Initial Room Name: ${this.state.roomName}`);
        console.log(`[${this.state.roomName}] Initial Room Owner: ${this.state.roomOwner}`);

        this.onMessage("*", (client, type, message) => {
            this.handleMessage(client, type as ChatRoomCommands, message);
        });
    }

    private handleMessage(client: Client, type: ChatRoomCommands, message: any) {
        console.log(`[${this.state.roomName}] Received message of type ${type} from ${this.state.players.get(client.sessionId)?.id}:`, message);
        switch (type) {

            case ChatRoomCommands.CHAT_MESSAGE:
                this.chatRoomController.handleMessage(client, message);
                break;

            default:
                console.log(`Unknown message type: ${type}`);

        }
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
        this.chatRoomController.handleUserJoining(client, player.id);
    }

    onLeave(client: Client, consented: boolean) {
        const player = this.state.players.get(client.sessionId);

        if (player) {
            console.log(`[${this.state.roomName}] Client left: ${player.id}`);
            this.chatRoomController.handleUserLeaving(client, player.id);
            this.state.players.delete(client.sessionId);

            if (player.id === this.state.roomOwner && this.state.players.size > 0) {
                const remainingPlayers = Array.from(this.state.players.values());
                this.state.roomOwner = remainingPlayers[0].id;
                console.log(`[${this.state.roomName}] New room owner: ${this.state.roomOwner}`);
            }

        } else {
            console.log(`[${this.state.roomName}] Client left: ${client.sessionId}`);
        }
        console.log(`[${this.state.roomName}] Remaining players:`, Array.from(this.state.players.values()).map(p => p.id));
    }

    async onDispose() {
        try {
            const rooms: RoomListingData<any>[] = await matchMaker.query({ name: "Lobby" });
            if (rooms.length > 0) {
                const lobbyRoomId = rooms[0].roomId;
                const lobby = await matchMaker.getRoomById(lobbyRoomId) as Room & { removeChatRoom: (roomId: string) => void };
                if (lobby && typeof lobby.removeChatRoom === "function") {
                    lobby.removeChatRoom(this.roomId);
                }
            }
            console.log(`[${this.state.roomName}] Room disposed.`);
        } catch (error) {
            console.error(`[${this.state.roomName}] Error while disposing room:`, error);
        }
    }
}
