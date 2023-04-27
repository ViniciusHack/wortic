import { RoomWord } from "@prisma/client";
import { NextApiResponse } from "next";
import prisma from "../../services/prisma";
import { ensureAuthenticated, EnsureAuthenticatedRequest } from "../../shared/middlewares/ensureAuthenticated";

interface RoomRequest extends EnsureAuthenticatedRequest {
  body: {
    name: string;
    image_url?: string;
    words: RoomWord[]
  }
}

const handler = async (req: RoomRequest, res: NextApiResponse) => { 
  switch (req.method) {
    case "POST":
      // TO DO: handle user authentication
      const { player } = req
      const { name, image_url, words } = req.body

      const playerFound = await prisma.player.findUnique({
        where: {
          email: player.email
        }
      })

      if(!playerFound) {
        return res.status(401).json({ message: 'Player not found'})
      }

      const room = await prisma.room.create({
        data: {
          name,
          image_url,
          ownerId: playerFound.id,
          words: {
            createMany: {
              data: words
            }
          }
        }
      })
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