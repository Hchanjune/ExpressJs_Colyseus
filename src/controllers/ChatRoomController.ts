import {ChatRoomState} from "../schemas/ChatRoomState";
import {Client, Room} from "colyseus";
import {ChatRoom} from "../rooms/ChatRoom";

export enum ChatRoomCommands {
    CHAT_MESSAGE = "CHAT_MESSAGE",

}

export enum ChatRoomResponses {
    CHAT_ECHO = "CHAT_ECHO",
    USER_JOINED = "USER_JOINED",
    USER_LEAVED = "USER_LEAVED"
}

export class ChatRoomController {
    constructor(private state: ChatRoomState) {}


    async handleMessage(room: ChatRoom, client: Client, message: any) {
        console.log(`${message.id}: ${message.message}`);
        const response = { id: message.id, message: message.message };
        room.broadcast(ChatRoomResponses.CHAT_ECHO, response);
    }

    async handleUserJoining(room: ChatRoom, client: Client, userId: string) {
        const response = { id: `System`, message: `${userId} Has Joined The Room` };
        room.broadcast(ChatRoomResponses.CHAT_ECHO, response);
    }

    async handleUserLeaving(room: ChatRoom, client: Client, userId: string) {
        const response = { id: `System`, message: `${userId} Has Leaved The Room` };
        room.broadcast(ChatRoomResponses.CHAT_ECHO, response);
    }


}
