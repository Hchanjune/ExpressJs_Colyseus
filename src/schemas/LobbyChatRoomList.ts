import {Schema, type} from "@colyseus/schema";


export class LobbyChatRoomList extends Schema {
    @type("string")
    roomId = ""
    @type("string")
    roomOwner = ""
    @type("string")
    roomName = ""
    @type("string")
    created = new Date().toISOString();
}
