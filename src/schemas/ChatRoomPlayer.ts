import {Schema, type} from "@colyseus/schema";

export class ChatRoomPlayer extends Schema {
    @type("string")
    id: string = "";

    @type("string")
    name: string = "";

    @type("boolean")
    isOwner: boolean = false;

    @type("boolean")
    isReady: boolean = false;
}
