import { Box, Center } from '@chakra-ui/react';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { RoomList } from '../../components/RoomList';
import { Header } from '../../components/RoomList/Header';
import { getSocket } from '../../shared/services/socket';
import { IFilter } from '../../types';

export function Home() {
  const [filter, setFilter] = useState<IFilter>({ tag: "all", value: "" });

  const handleFilter = (filter: Partial<IFilter>) => {
    setFilter(prevState => {
      return {
        ...prevState,
        ...filter
      }
    })
  }

  useEffect(() => {
    async function socketConnection() {
      await getSocket()
    }
    socketConnection()
  }, [])

  return (
    <Center h="100vh">
      <Head>
        <title>Rooms | Wortic</title>
      </Head>
      <Box bg="gray.700" p="4" rounded="4" w="75%">
        <Header currentFilter={filter} handleFilter={handleFilter}/>
        <Box py="8">
          <RoomList />
        </Box>
      </Box>
    </Center>
  )
}
