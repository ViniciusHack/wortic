import { NextApiResponse } from "next";
import { ensureAuthenticated, EnsureAuthenticatedRequest } from "../../../shared/middlewares/ensureAuthenticated";
import prisma from "../../../shared/services/prisma";

const handler = async (req: EnsureAuthenticatedRequest, res: NextApiResponse) => { 
  switch (req.method) {
    case "GET":
      if(!req.query.roomId) {
        return res.status(400).json({
          message: "Invalid room ID",
          code: "invalid.roomId"
        })
      }
      const room = await prisma.room.findUnique({
        where: {
          id: req.query.roomId as string
        },
        // include: {
        //   owner: true
        // }
      })
      return res.json(room)
    default:
      return res.status(405)
  }
}

export default ensureAuthenticated(handler)