import { RoomWord } from "@prisma/client";
import { NextApiResponse } from "next";
import { createRoomSchemaBody } from "../../../components/RoomList/Modals/ModalNewRoom";
import { PrismaPlayersRepository } from "../../../repositories/prisma/PrismaPlayersRepository";
import { PrismaRoomsRepository } from "../../../repositories/prisma/PrismaRoomsRepository";
import { ensureAuthenticated, EnsureAuthenticatedRequest } from "../../../shared/middlewares/ensureAuthenticated";
import prisma from "../../../shared/services/prisma";
import { CreateRoomUseCase } from "../../../useCases/CreateRoomUseCase";

interface RoomRequest extends EnsureAuthenticatedRequest {
  body: {
    name: string;
    winnerScore?: number;
    gameTime?: number;
    image_url?: string;
    words: RoomWord[]
  }
}

const handler = async (req: RoomRequest, res: NextApiResponse) => { 
  switch (req.method) {
    case "POST":
      // TO DO: handle user authentication
      const { player } = req
      const { words } = req.body

      const { name, image_url, winnerScore, gameTime } = createRoomSchemaBody.parse(req.body)
      
      const roomsRepository = new PrismaRoomsRepository()
      const playersRepository = new PrismaPlayersRepository()
      const createRoomUseCase = new CreateRoomUseCase(roomsRepository, playersRepository)
      const room = await createRoomUseCase.execute({ name, image_url, winnerScore, gameTime, playerEmail: player.email, words })

      return res.status(201).json(room)
    case "GET":
      const rooms = await prisma.room.findMany({
        include: {
          owner: true
        }
      })
      return res.json(rooms)
    default:
      return res.status(405)
  }
}

export default ensureAuthenticated(handler)