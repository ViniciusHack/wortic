import { RoomWS } from "../pages/api/socketio"

interface DisconnectRoomUseCaseParams {
  rooms: Map<string, RoomWS>
  roomId: string
  name: string
}

export class DisconnectRoomUseCase {
  constructor(){}

  async execute({ name, rooms, roomId }: DisconnectRoomUseCaseParams) {
    const room = rooms.get(roomId)!
    room.players = room.players.filter(player => player.name !== name)

    if(room.players.length === 0) {
      rooms.delete(roomId)
    } else {
      rooms.set(roomId, room)
    }
  }
}