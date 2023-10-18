import { Avatar, Box, Center, Flex, Grid, IconButton, Modal, ModalOverlay, Text } from "@chakra-ui/react"
import { Room as RoomType } from "@prisma/client"
import Head from "next/head"
import { useRouter } from "next/router"
import { CheckCircle, CrownSimple, Pencil, Question, Warning, XCircle } from "phosphor-react"
import { useEffect, useState } from "react"
import { ModalInfo } from "../../components/Room/Modals/ModalInfo"
import { ModalReportWord } from "../../components/Room/Modals/ModalReportWord"
import { WordBoard } from "../../components/Room/WordBoard"
import { api } from "../../shared/services/api"
import { getSocket } from "../../shared/services/socket"

type Status = "done" | "doing" | "lost" | "hosting"

export interface RoomPlayer {
  name: string;
  image: string;
  email: string;
  score: number;
  status: Status;
}

interface RoomExtended extends RoomType {
  letters_quantity: number;
}

const mockUsers = [
  {
    name: "Prófe",
    image: "https://cdn.discordapp.com/attachments/953775498310320148/1092848697685069834/e8524b84-0e68-4614-ab7c-68b28983133c.png",
    score: 110,
    status: "done",
  },
  {
    name: "Hercílio da Costa",
    image: "https://cdn.discordapp.com/attachments/953775498310320148/975149075689271296/unknown.png",
    score: 90,
    status: "doing",
  },
  {
    name: "Vinícius Wilbert",
    image: "https://cdn.discordapp.com/attachments/953775498310320148/970138141749030922/unknown.png",
    score: 85,
    status: "hosting",
  },
  {
    name: "Guigas Schneider",
    image: "https://cdn.discordapp.com/attachments/478684362813210646/975100996135038986/unknown.png",
    score: 0,
    status: "lost",
  },
]

mockUsers.sort((a, b) => {
  return b.score - a.score
})

const icons = {
  "done": CheckCircle,
  "doing": null,
  "hosting": Pencil,
  "lost": XCircle
} as const

const iconsColor = {
  "done": "green.400",
  "doing": "",
  "hosting": "blue.400",
  "lost": "red.400"
}

const crownColor = {
  0: "yellow.400",
  1: "gray.400",
  2: "orange.800"
}

export default function Room() {
  const [players, setPlayers] = useState<RoomPlayer[]>([])
  const [room, setRoom] = useState<RoomExtended | undefined>();
  const [roomRealTime, setRoomRealTime] = useState({
    timeLeft: 0,
    status: "WAITING",
    answer: '',
    reason: ''
  })
  const [isModalInfoOpen, setIsModalInfoOpen] = useState(false)
  const [isModalReportWordOpen, setIsModalReportWordOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    async function fetchRoom() {
      const socket = await getSocket()
      if(router.query.roomId && socket) {
        const response = await api.get(`/rooms/${router.query.roomId}`)
        setRoom(response.data)
        socket.on("room_updated", (players: RoomPlayer[]) => {
          setPlayers(players)
        })
        socket.on("word_letters", (word_letters: number) => {
          setRoom(state => {
            return {
              ...state!,
              letters_quantity: word_letters,
            }
          })
        })
        socket.on("round_end", ({reason, answer}) => {
          setRoomRealTime(state => ({...state, reason, answer, status: "STARTING"}))
        })
        socket.on("time_left", (timeLeft: number) => {
          setRoomRealTime(state => ({ ...state, timeLeft, status: "RUNNING", reason: '' }))
        })
        socket.emit("join_room", router.query.roomId)
      }
    }
    fetchRoom()
  }, [router.query.roomId])

  return (
    <Center h="100vh" maxWidth="60%" m="0 auto">
      <Head>
        <title>Room | Wortic</title>
      </Head>
      <Grid templateColumns='1fr 2fr' gap={8} w="100%">
        <Box bg="blue.1000" p="4" pt="6" rounded="4" minH="500px">
          {/* <Image
            src="/logo.svg"
            width="12rem"
            height="5rem"
            alt="Wortic (logo)"
          /> */}
          {players.sort((a, b) => b.score - a.score).map((user, index) => {
            const Icon = icons[user.status as Status]
            const iconColor = iconsColor[user.status as Status]
            return (
              <Flex key={user.name + index} alignItems="center" gap={2} pt={index !== 0 ? "4" : "0"}>
                {/* <Box minW={5} color={iconColor}>
                  {Icon && <Icon size={20} weight="fill" />}
                </Box> */}
                <Box pos="relative">
                  <Avatar zIndex={3} src={user.image}/>
                  {(index === 0 || index === 1 || index === 2) &&
                    <Box color={crownColor[index]} transform="rotate(-30deg)" pos="absolute" top="-10px">
                      <CrownSimple size={20} weight="fill" />
                    </Box>
                  }
                </Box>
                <Box>
                  <Text textOverflow="ellipsis" overflow="hidden" whiteSpace="nowrap" maxW="200px" fontWeight={600} fontSize={18}>{user.name}</Text>
                  <Text fontWeight={500} lineHeight={0.5} fontSize={14}>{user.score} pts.</Text>
                </Box>
              </Flex>
            )
          })}
        </Box>
        <Box bg="blue.1000" position="relative" rounded="4">
          <Box p="8">
            {roomRealTime.status === "RUNNING" &&
            <>
              <Flex color="gray.600" justifyContent="space-between">
                <Modal isOpen={isModalInfoOpen} onClose={() => setIsModalInfoOpen(false)} isCentered> {/*isCentered, motionPreset backdropFilters*/}
                  <ModalOverlay backdropFilter="blur(6px)"/>
                  <ModalInfo onClose={() => setIsModalInfoOpen(false)}/>
                </Modal>
                <IconButton
                  aria-label='Show tutorial info'
                  color="gray.500"
                  bg="transparent"
                  size="md"
                  _hover={{ bg: "gray.700"}}
                  _focus={{ bg: "transparent"}}
                  icon={<Question weight="fill" size={24} />}
                  onClick={() => setIsModalInfoOpen(true)}
                />

                <Modal isOpen={isModalReportWordOpen} onClose={() => setIsModalReportWordOpen(false)} isCentered> {/*isCentered, motionPreset backdropFilters*/}
                  <ModalOverlay/>
                  <ModalReportWord onClose={() => setIsModalReportWordOpen(false)}/>
                </Modal>

                <IconButton
                  aria-label='Report word'
                  color="gray.500"
                  bg="transparent"
                  size="md"
                  _hover={{ bg: "gray.700"}}
                  _focus={{ bg: "transparent"}}
                  icon={<Warning weight="fill" size={24} />}
                  onClick={() => setIsModalReportWordOpen(true)}
                />
              </Flex>
              <Text fontSize={26} fontWeight={700} pt="2" pb="4" textAlign="center">Adivinhe a palavra:</Text>
              {room && <WordBoard lettersQuantity={room.letters_quantity} />}
            </>}
            {roomRealTime.status === "STARTING" && (
              <Center><Text fontSize={22}>Começando nova rodada... ({roomRealTime.reason === "hits" ? 'Todos acertaram!' : 'Tempo esgotado!'}). A resposta era: {roomRealTime.answer}</Text></Center>
            )}
            {roomRealTime.status === "WAITING" && (
              <Center><Text fontSize={22}>Esperando jogadores para iniciar...</Text></Center>
            )}
          </Box>
          <Box 
            position="absolute" 
            bottom={0} 
            w="full"
            h="2" 
            bg="purple.200"
          >
            <Box 
              h="full" 
              bg="purple.500" 
              w={`${((roomRealTime.timeLeft / 1000) / (room?.gameTime ?? 60)) * 100}%`} 
              transition="width 1s linear"
            />
          </Box>
        </Box>
      </Grid>
    </Center>
  )
}