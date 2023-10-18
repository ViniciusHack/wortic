import prisma from "../../shared/services/prisma";
import { PlayersRepository } from "../PlayersRepository";


export class PrismaPlayersRepository implements PlayersRepository {
  async findByEmail(email: string) {
    const player = await prisma.player.findUnique({
      where: {
        email
      }
    })

    return player
  }
}