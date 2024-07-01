import {Client, matchMaker, Room, RoomListingData} from "colyseus";
import {ChatRoomState} from "../schemas/ChatRoomState";
import {Lobby} from "./Lobby";
import {ChatRoomCommands, ChatRoomController, ChatRoomResponses} from "../controllers/ChatRoomController";
import {ChatRoomPlayer} from "../schemas/ChatRoomPlayer";


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
        //console.log(`[${this.state.roomName}] Received message of type ${type} from ${this.state.chatRoomPlayers.get(client.sessionId)?.id}:`, message);
        switch (type) {

            case ChatRoomCommands.CHAT_MESSAGE:
                this.chatRoomController.handleMessage(this, client, message);
                break;

            case ChatRoomCommands.PLAYER_READY_STATUS_CHANGE:
                this.chatRoomController.handleUserReadyState(this, client, message);
                break;

            case ChatRoomCommands.START_REQUEST:
                this.chatRoomController.handleStartRequest(this, client);
                break;

            //
            case ChatRoomCommands.UPDATE_POSITION:
                this.chatRoomController.handleUnitPositions(this, client, message);
                break;

            default:
                console.log(`Unknown message type: ${type}`);

        }
    }

    onJoin(client: Client, options: any) {
        const playerId = options.id;

        for (const [sessionId, player] of this.state.chatRoomPlayers.entries()) {
            if (player.id === playerId) {
                console.log(`[${this.state.roomName}] Client with ID ${playerId} already connected. Kicking new connection.`);
                client.leave();
                return;
            }
        }

        const player = new ChatRoomPlayer();
        player.id = playerId;
        player.name = "Player " + this.clients.length;
        player.isOwner = player.id === this.state.roomOwner;
        player.isReady = player.isOwner;
        this.state.chatRoomPlayers.set(client.sessionId, player);

        console.log(`[${player.id}] joined To Chat Room Name [${this.state.roomName}] Owner [${this.state.roomOwner}]`);
        console.log(`[${this.state.roomName}] Current players:`, Array.from(this.state.chatRoomPlayers.values()).map(p => p.id));
        this.chatRoomController.handleUserJoining(this, client, player.id);
    }

    onLeave(client: Client, consented: boolean) {
        const player = this.state.chatRoomPlayers.get(client.sessionId);

        if (player) {
            console.log(`[${this.state.roomName}] Client left: ${player.id}`);
            this.chatRoomController.handleUserLeaving(this, client, player.id);
            this.state.chatRoomPlayers.delete(client.sessionId);

            if (player.id === this.state.roomOwner && this.state.chatRoomPlayers.size > 0) {
                const remainingPlayers = Array.from(this.state.chatRoomPlayers.values());
                const newOwner = remainingPlayers[0];
                newOwner.isOwner = true;  // 새로운 방장을 설정
                newOwner.isReady = true;
                this.state.roomOwner = newOwner.id;

                console.log(`[${this.state.roomName}] New room owner: ${this.state.roomOwner}`);
                this.broadcast(ChatRoomResponses.CHAT_ECHO, { id: `System`, message: `${newOwner.id} Has Been Selected As New Owner` });
            }

        } else {
            console.log(`[${this.state.roomName}] Client left: ${client.sessionId}`);
        }
        console.log(`[${this.state.roomName}] Remaining players:`, Array.from(this.state.chatRoomPlayers.values()).map(p => p.id));
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
