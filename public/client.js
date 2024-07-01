"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const colyseus_js_1 = require("colyseus.js");
const joinBtn = document.getElementById("join-btn");
if (joinBtn) {
    joinBtn.addEventListener("click", () => __awaiter(void 0, void 0, void 0, function* () {
        const client = new colyseus_js_1.Client('ws://localhost:3000');
        try {
            const room = yield client.joinOrCreate("sample_room");
            console.log("Joined successfully:", room);
            room.onMessage("message", (message) => {
                console.log("Received message from server:", message);
            });
            room.send("message", "Hello, server!");
        }
        catch (e) {
            console.error("Failed to join room:", e);
        }
    }));
}
