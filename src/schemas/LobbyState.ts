import { MapSchema, Schema, type} from "@colyseus/schema";
import {Player} from "./Player";
import {ChatRoom} from "../rooms/ChatRoom";
import {LobbyChatRoomList} from "./LobbyChatRoomList";

export class LobbyState extends Schema {
    @type({ map: Player })
    players = new MapSchema<Player>();
    @type( { map: LobbyChatRoomList } )
    chatRoomList = new MapSchema<LobbyChatRoomList>();
}
