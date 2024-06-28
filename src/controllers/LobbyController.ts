import {LobbyState} from "../schemas/LobbyState";
import {Client, matchMaker} from "colyseus";
import {LobbyChatRoomList} from "../schemas/LobbyChatRoomList";

export enum LobbyCommands {
    CREATE_CHAT_ROOM = "CREATE_CHAT_ROOM",
    GET_CHAT_ROOM_LIST = "GET_CHAT_ROOM_LIST"

}

export enum LobbyResponses {
    CHAT_ROOM_CREATED = "CHAT_ROOM_CREATED",
    CHAT_ROOM_LIST = "CHAT_ROOM_LIST"
}

export class LobbyController {
    constructor(private state: LobbyState) {}



    async handleCreateChatRoom(client: Client, message: any) {
        const chatRoomId = `${message.roomName}`;
        try {
            console.log("Attempting to create chat room with ID:", chatRoomId);
            const chatRoom = await matchMaker.createRoom("ChatRoom", { roomName: chatRoomId, roomOwner: message.roomOwner });
            console.log("Chat room created with ID:", chatRoom.roomId);
            console.log("Chat room created with Name:", message.roomName);
            console.log("Chat room created with Owner:", message.roomOwner);

            const newChatRoom = new LobbyChatRoomList();
            newChatRoom.roomId = chatRoom.roomId;
            newChatRoom.roomName = message.roomName;
            newChatRoom.roomOwner = message.roomOwner;
            newChatRoom.created = new Date().toISOString();

            this.state.chatRoomList.set(chatRoom.roomId, newChatRoom);
            console.log("Updated chatRoomList:", JSON.stringify(this.state.chatRoomList));

            const response = { createdRoomId: chatRoom.roomId };
            console.log("Sending response:", response);
            client.send(LobbyResponses.CHAT_ROOM_CREATED, response);
        } catch (e) {
            console.error("Error creating chat room:", e);
            client.send("error", { message: "Failed to create chat room" });
        }
    }



}
