import {ChatRoomState} from "../schemas/ChatRoomState";
import {Client, Room} from "colyseus";
import {ChatRoom} from "../rooms/ChatRoom";
import {response} from "express";

export enum ChatRoomCommands {
    CHAT_MESSAGE = "CHAT_MESSAGE",
    PLAYER_READY_STATUS_CHANGE = "PLAYER_READY_STATUS_CHANGE",
    START_REQUEST = "START_REQUEST",
    //
    UPDATE_POSITION = "UPDATE_POSITION"

}

export enum ChatRoomResponses {
    CHAT_ECHO = "CHAT_ECHO",
    PLAYER_NOT_READY = "PLAYER_NOT_READY",
    START = "START",
    //
    UNIT_POSITION = "UNIT_POSITION",
}

export class ChatRoomController {
    constructor(private state: ChatRoomState) {}


    async handleMessage(room: ChatRoom, client: Client, message: any) {
        console.log(`${message.id}: ${message.message}`);
        const response = { id: message.id, message: message.message };
        room.broadcast(ChatRoomResponses.CHAT_ECHO, response);
    }

    async handleUserJoining(room: ChatRoom, client: Client, userId: string) {
        const response = { id: `System`, message: `${userId} Has Joined The Room` };
        room.broadcast(ChatRoomResponses.CHAT_ECHO, response);
    }

    async handleUserLeaving(room: ChatRoom, client: Client, userId: string) {
        const response = { id: `System`, message: `${userId} Has Leaved The Room` };
        room.broadcast(ChatRoomResponses.CHAT_ECHO, response);
    }

    async handleUserReadyState(room: ChatRoom, client: Client, message: any) {
        const player = room.state.chatRoomPlayers.get(client.sessionId);
        if (player) {
            player.isReady = message.isReady;
        }
        const response = { id: `System`, message: message.isReady ? `${message.id} Is Ready!` : `${message.id} Has Canceled The Ready State!` };
        room.broadcast(ChatRoomResponses.CHAT_ECHO, response);
    }

    async handleStartRequest(room: ChatRoom, client: Client) {
        const requestPlayer = room.state.chatRoomPlayers.get(client.sessionId);
        const response = { id: `System`, message: `` };

        if (requestPlayer && requestPlayer.isOwner) {
            const notReadyPlayers: string[] = [];

            room.state.chatRoomPlayers.forEach(player => {
                if (!player.isReady) {
                    notReadyPlayers.push(player.id);
                }
            });

            if (notReadyPlayers.length === 0) {
                // 모든 플레이어가 준비됨
                room.broadcast(ChatRoomResponses.CHAT_ECHO, { id: 'System', message: 'All players are ready to start' });
                await room.lock();

                // 5초 카운트다운 시작
                this.startCountdown(room);

            } else {
                // 준비되지 않은 플레이어가 있음
                response.message = `${notReadyPlayers.length} players have not been ready yet: [${notReadyPlayers.join(', ')}]`;
                room.broadcast(ChatRoomResponses.PLAYER_NOT_READY);
                room.broadcast(ChatRoomResponses.CHAT_ECHO, response);
            }
        } else {
            room.broadcast(ChatRoomResponses.CHAT_ECHO, { id: 'System', message: 'Invalid Request' });
        }
    }

    private startCountdown(room: ChatRoom) {
        let secondsLeft = 5;
        const interval = setInterval(() => {
            room.broadcast(ChatRoomResponses.CHAT_ECHO, { id: 'System', message: `${secondsLeft} seconds to start...` });
            secondsLeft--;
        }, 1000);

        const timeout = setTimeout(() => {
            clearInterval(interval);
            if (room.state.chatRoomPlayers.size > 0) {
                room.broadcast(ChatRoomResponses.CHAT_ECHO, { id: 'System', message: 'Game is starting!' });
                room.broadcast(ChatRoomResponses.START, { id: 'System', message: 'START' });
            } else {
                room.broadcast(ChatRoomResponses.CHAT_ECHO, { id: 'System', message: 'Start cancelled, players left the room.' });
            }
        }, 5000);

        // 플레이어 나감 이벤트 처리
        const onLeave = () => {
            clearInterval(interval);
            clearTimeout(timeout);
            room.broadcast(ChatRoomResponses.CHAT_ECHO, { id: 'System', message: 'Start cancelled, a player left the room.' });
            room._events.off('leave', onLeave);  // 이벤트 리스너 제거
        };

        // 플레이어 나감 이벤트 리스너 추가
        room._events.on('leave', onLeave);
    }


    //
    async handleUnitPositions(room: ChatRoom, client: Client, message: any){
        const unitPosition = {
            id : room.state.chatRoomPlayers.get(client.sessionId)?.id,
            transformX: message.transformX,
            transformY: message.transformY,
            transformZ: message.transformZ,
            rotationX: message.rotationX,
            rotationY: message.rotationY,
            rotationZ: message.rotationZ,
            rotationW: message.rotationW,
        }
        room.broadcast(ChatRoomResponses.UNIT_POSITION, unitPosition);
    }

}
