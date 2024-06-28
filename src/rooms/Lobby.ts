import {Client, Room} from "colyseus";
import {LobbyState} from "../schemas/LobbyState";
import {Player} from "../schemas/Player";
import {LobbyCommands, LobbyController} from "../controllers/LobbyController";

export class Lobby extends Room<LobbyState> {

    private lobbyController: LobbyController;

    constructor() {
        super();
        this.setState(new LobbyState());
        this.lobbyController = new LobbyController(this.state);
    }

    onCreate(options: any) {
        console.log(`[Lobby] ${this.roomName} Successfully Created`);

        this.onMessage("*", (client, type, message) => {
            this.handleMessage(client, type as LobbyCommands, message);
        });
    }


    private handleMessage(client: Client, type: LobbyCommands, message: any) {
        console.log(`[Lobby] Received message of type ${type} from ${this.state.players.get(client.sessionId)?.id}:`, message);
        switch (type) {

            case LobbyCommands.CREATE_CHAT_ROOM:
                this.lobbyController.handleCreateChatRoom(client, message);
                break;

            default:
                console.log(`Unknown message type: ${type}`);

        }
    }

    onJoin(client: Client, options: any) {
        const playerId = options.id;

        // 동일한 ID가 이미 존재하는지 확인
        for (const [sessionId, player] of this.state.players.entries()) {
            if (player.id === playerId) {
                console.log(`[Lobby] Client with ID ${playerId} already connected. Kicking new connection.`);
                client.leave();
                return;
            }
        }

        const player = new Player();
        player.id = playerId;
        player.name = "Player " + this.clients.length;
        this.state.players.set(client.sessionId, player);
        console.log(`[Lobby] Client joined: ${player.id}`);
        // 클라이언트가 방에 조인할 때의 로직
    }

    onLeave(client: Client, consented: boolean) {
        const player = this.state.players.get(client.sessionId);
        if (player) {
            console.log(`[Lobby] Client left: ${player.id}`);
            this.state.players.delete(client.sessionId);
        } else {
            console.log(`[Lobby] Client left: ${client.sessionId}`);
        }
        // 클라이언트가 방을 떠날 때의 로직
    }

    onDispose() {
        console.log(`Dispose ${this.roomName}`);
        // 방이 삭제될 때의 로직
    }

    removeChatRoom(chatRoomId: string) {
        if (this.state.chatRoomList.has(chatRoomId)) {
            this.state.chatRoomList.delete(chatRoomId);
            console.log(`[Lobby] Chat room ${chatRoomId} removed from list.`);
        }
    }
}
