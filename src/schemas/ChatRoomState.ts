import { Schema, type, MapSchema } from "@colyseus/schema";
import {ChatRoomPlayer} from "./ChatRoomPlayer";

export class ChatRoomState extends Schema {
    @type("string")
    roomName = ""
    @type("string")
    roomOwner = ""
    @type({ map: ChatRoomPlayer })
    chatRoomPlayers = new MapSchema<ChatRoomPlayer>();
}
