import { Schema, type } from "@colyseus/schema";

export class SampleRoomState extends Schema {
    @type("string")
    public field: string = "Hello, world!";
}
