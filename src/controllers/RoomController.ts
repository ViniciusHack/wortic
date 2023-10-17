import { Server, Socket } from "socket.io"
import { DefaultEventsMap } from "socket.io/dist/typed-events"
import { RoomWS } from "../pages/api/socketio"
import { PrismaRoomsRepository } from "../repositories/prisma/PrismaRoomsRepository"
import { PrismaRoomWordsRepository } from "../repositories/prisma/PrismaRoomWordsRepository"
import { DisconnectRoomUseCase } from "../useCases/DisconnectRoomUseCase"
import { JoinRoomUseCase } from "../useCases/JoinRoomUseCase"
import { StartRoundUseCase } from "../useCases/StartRoundUseCase"
import { ValidateWordSentUseCase } from "../useCases/ValidateWordSentUseCase"

export class RoomController {
  constructor(
    private io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
    private socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
    private roomId: string,
    private rooms: Map<string, RoomWS>, 
    private user: { name: string; email: string; image: string },
  ) {}

  async startRound() {
    const startRoundUseCase = new StartRoundUseCase()
    const { room: updatedRoom } = await startRoundUseCase.execute({
      roomId: this.roomId,
      rooms: this.rooms,
      emit: (timeLeft) => this.updateTime(timeLeft),
      onEndRound: (reason) => this.endRound(reason),
    })

    this.rooms.set(this.roomId, updatedRoom)
    this.io.to(this.roomId).emit("word_letters", updatedRoom.currentWord.length)
  }

  async updateTime(timeLeft: number) {
    this.io.to(this.roomId).emit("time_left", timeLeft)
  }

  async endRound(reason: "timeout" | "hits") {
    const room = this.rooms.get(this.roomId)!
    clearInterval(room?.interval)

    this.io.to(this.roomId).emit("round_end", {
      reason,
      answer: room?.currentWord
    })

    const timeout = setTimeout(() => {
      clearTimeout(timeout)
      this.startRound()
    }, 10000)
  }
  
  async disconnect() {
    const disconnectRoomUseCase = new DisconnectRoomUseCase()
    await disconnectRoomUseCase.execute({
      name: this.user.name,
      roomId: this.roomId,
      rooms: this.rooms
    })
    
    this.io.to(this.roomId).emit("room_updated", this.rooms.get(this.roomId)?.players ?? [])
  }

  async join() {
    const roomWordsRepository = new PrismaRoomWordsRepository()
    const roomsRepository = new PrismaRoomsRepository()
    const joinRoomUseCase = new JoinRoomUseCase(roomWordsRepository, roomsRepository)
    
    let { room } = await joinRoomUseCase.execute({
      roomId: this.roomId,
      rooms: this.rooms,
      user: {
        image: this.user.image,
        name: this.user.name,
        email: this.user.email,
      }
    })
    this.rooms.set(this.roomId, room)
    this.socket.join(this.roomId)

    if(room.currentWord.length > 0) {
      this.io.to(this.roomId).emit("word_letters", room.currentWord.length)
    }

    this.io.to(this.roomId).emit("room_updated", room.players)

    if(room.players.length > 1 && !room.currentWord) {
      await this.startRound()
    }
  }

  async wordAnalysis(wordSent: string) {
    const validateWordSentUseCase = new ValidateWordSentUseCase()
    const { positions, playerScoredIndex } = await validateWordSentUseCase.execute({
      rooms: this.rooms,
      roomId: this.roomId,
      user: this.user,
      wordSent
    })

    if(playerScoredIndex !== null) {
      const room = this.rooms.get(this.roomId)!

      room.players.splice(playerScoredIndex, 1, {
        ...room.players[playerScoredIndex],
        score: room.players[playerScoredIndex].score + (Math.max(10 - room.currentHits, 1))
      })

      room.currentHits += 1

      this.rooms.set(this.roomId, room)

      this.io.to(this.roomId).emit("room_updated", room.players)

      if(room.currentHits === room.players.length) {
        await this.endRound("hits")
      }
    }

    this.socket.emit("word_response", positions)
  }
}