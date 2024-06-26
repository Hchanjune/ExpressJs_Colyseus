import { Room, Client } from "colyseus";
import { SampleRoomState } from "../states/SampleRoomState";

export class SampleRoom extends Room<SampleRoomState> {
    onCreate(options: any) {
        this.setState(new SampleRoomState());

        this.onMessage("message", (client, message) => {
            console.log(`MyRoom received message from ${client.sessionId}:`, message);
            // 메시지 처리 로직
        });
    }

    onJoin(client: Client, options: any) {
        console.log(`Client joined: ${client.sessionId}`);
        // 클라이언트가 방에 조인할 때의 로직
    }

    onLeave(client: Client, consented: boolean) {
        console.log(`Client left: ${client.sessionId}`);
        // 클라이언트가 방을 떠날 때의 로직
    }

    onDispose() {
        console.log("Dispose MyRoom");
        // 방이 삭제될 때의 로직
    }
}
