import { MapSchema, Schema, type} from "@colyseus/schema";
import {Player} from "./Player";

export class LobbyState extends Schema {
    @type({ map: Player })
    players = new MapSchema<Player>();
}
