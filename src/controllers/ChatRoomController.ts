import {ChatRoomState} from "../schemas/ChatRoomState";
import {Client} from "colyseus";

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


    async handleMessage(client: Client, message: any){
        console.log(`${message.id}: ${message.message}`);
        const response = { id: message.id, message: message.message };
        client.send(ChatRoomResponses.CHAT_ECHO, response);
    }

    async handleUserJoining(client: Client, userId: string){
        const response = { id: `System`, message: `${userId} Has Joined The Room` };
        client.send(ChatRoomResponses.CHAT_ECHO, response);
    }

    async handleUserLeaving(client: Client, userId: string){
        const response = { id: `System`, message: `${userId} Has Leaved The Room` };
        client.send(ChatRoomResponses.CHAT_ECHO, response);
    }


}
