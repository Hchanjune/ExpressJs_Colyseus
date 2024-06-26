import { Client } from "colyseus.js";

const joinBtn = document.getElementById("join-btn");

if (joinBtn) {
    joinBtn.addEventListener("click", async () => {
        const client = new Client('ws://localhost:3000');

        try {
            const room = await client.joinOrCreate("sample_room");
            console.log("Joined successfully:", room);

            room.onMessage("message", (message) => {
                console.log("Received message from server:", message);
            });

            room.send("message", "Hello, server!");
        } catch (e) {
            console.error("Failed to join room:", e);
        }
    });
}
