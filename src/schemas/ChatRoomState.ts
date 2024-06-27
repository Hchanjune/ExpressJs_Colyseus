import { Schema, type, MapSchema } from "@colyseus/schema";
import { Player } from "./Player";

export class ChatRoomState extends Schema {
    @type({ map: Player })
    players = new MapSchema<Player>();
}
