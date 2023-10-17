import { RoomWord } from "@prisma/client";
import { PlayersRepository } from "../repositories/PlayersRepository";
import { RoomsRepository } from "../repositories/RoomsRepository";
import { PlayerNotFoundError } from "./errors/PlayerNotFoundError";

interface CreateRoomUseCaseParams {
  playerEmail: string;
  name: string;
  image_url?: string;
  winnerScore?: number;
  gameTime?: number;
  words: Omit<RoomWord, 'roomId'>[]
}

export class CreateRoomUseCase {
  constructor(private roomsRepository: RoomsRepository, private playersRepository: PlayersRepository) {}

  async execute({ playerEmail, name, words, gameTime, image_url, winnerScore }: CreateRoomUseCaseParams) {
    const playerFound = await this.playersRepository.findByEmail(playerEmail)

    if(!playerFound) {
      return new PlayerNotFoundError()
    }

    const room = await this.roomsRepository.createWithWords({
      room: {
        name,
        image_url,
        ownerId: playerFound.id,
        winnerScore,
        gameTime,
      },
      words
    })

    return room
  }
}