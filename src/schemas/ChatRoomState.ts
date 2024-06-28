import { Schema, type, MapSchema } from "@colyseus/schema";
import { Player } from "./Player";

export class ChatRoomState extends Schema {
    @type("string")
    roomName = ""
    @type("string")
    roomOwner = ""
    @type({ map: Player })
    players = new MapSchema<Player>();
}
