import { RoomWord } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { Server, Socket } from 'socket.io'
import { DefaultEventsMap } from 'socket.io/dist/typed-events'
import { RoomController } from '../../controllers/RoomController'
import { RoomPlayer } from '../rooms/[roomId]'

interface NextApiResponseWithIo extends NextApiResponse {
  socket: NextApiResponse['socket'] & {
    server: {
      io: Server
    }
  }
}

export interface RoomWS {
  players: RoomPlayer[],
  currentHits: number,
  timeLeft: number,
  maxGameTime: number,
  winnerScore: number,
  currentWord: string,
  interval?: NodeJS.Timer
  words: RoomWord[]
}

const ioHandler = (req: NextApiRequest, res: NextApiResponseWithIo) => {
  if (!('io' in res.socket.server)) {
    const io = new Server(res.socket.server as any)

    const rooms = new Map<string, RoomWS>()
    io.on('connection', async (socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, {
      user: {
        email: string
        name: string;
        image: string;
      }
    }>) => {
      const session = await getSession({
        req: socket.request
      });

      if(!session || !session.user) {
        return res.status(401).json({ message: "Session not found" })
      } else {
        socket.data.user = {
          email: session.user.email!,
          name: session.user.name!,
          image: session.user.image!
        }
      }
      
      socket.on("join_room", async (roomId: string) => {
        const roomController = new RoomController(io, socket, roomId, rooms, socket.data.user!)
        await roomController.join()

        socket.on("disconnect", async () => {
          await roomController.disconnect()
        })

        socket.on("send_word", async (wordSent: string) => {
          await roomController.wordAnalysis(wordSent)
        })
      })
    })
  
    res.socket.server.io = io
  } else {
    console.log('socket.io already running')
  }  
  res.end()
}

export const config = {
  api: {
    bodyParser: false
  }
}

export default ioHandler
