import { SimpleGrid } from '@chakra-ui/react';
import { Player, Room } from '@prisma/client';
import { useEffect, useState } from 'react';
import { api } from '../../shared/services/api';
import { RoomItem } from './RoomItem';

interface RoomListProps {
  rooms:  (Room & {
    owner: Player;
  })[];
}

export function RoomList() {
  const [rooms, setRooms] = useState<(Room & {
    owner: Player;
  })[]>([]);
  
  useEffect(() => {
    async function fetchRooms() {
      const response = await api.get("/rooms")
      setRooms(response.data)
    }

    fetchRooms()
  }, [])
  
  return (
    <SimpleGrid 
      px="4"
      minChildWidth="300px"
      spacing="8"
      maxH="402px"
      overflowY="auto"
      sx={{
        '&::-webkit-scrollbar': {
          width: '2',
          rounded: 'full',
          bgColor: "gray.500",
        },
        '&::-webkit-scrollbar-thumb': {
          bgColor: "gray.800",
          rounded: 'full',
        },
      }}
    >
      {rooms.map(room => (
        <RoomItem key={room.id} {...room} />
      ))}
    </SimpleGrid>
  )
}


// export const getServerSideProps: GetServerSideProps = async () => {
//   const rooms = await prisma.room.findMany({
//     include: {
//       owner: true
//     }
//   }) || []

//   console.log("Aqui", rooms)


//   return {
//     props: {
//       rooms: []
//     },
//     // revalidate: 1
//   }
// }