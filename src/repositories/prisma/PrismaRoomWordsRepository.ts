import prisma from "../../shared/services/prisma";
import { RoomWordsRepository } from "../RoomWordsRepository";

export class PrismaRoomWordsRepository implements RoomWordsRepository {
  async findManyByRoom(roomId: string) {
    const words = await prisma.roomWord.findMany({
      where: {
        roomId
      }
    })

    return words
  }

}