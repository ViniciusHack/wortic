import { Box, Center } from '@chakra-ui/react';
import type { NextPage } from 'next';
import { useState } from 'react';
import { RoomList } from '../components/RoomList';
import { Header } from '../components/RoomList/Header';
import { IFilter } from '../types';

const Home: NextPage = () => {
  const [filter, setFilter] = useState<IFilter>({ tag: "all", value: "" });

  const handleFilter = (filter: Partial<IFilter>) => {
    setFilter(prevState => {
      return {
        ...prevState,
        ...filter
      }
    })
  }

  return (
    <Center h="100vh">
      <Box bg="gray.700" p="4" rounded="4" w="8xl">
        <Header currentFilter={filter} handleFilter={handleFilter}/>
        <Box py="8">
          <RoomList />
        </Box>
      </Box>
    </Center>
  )
}

export default Home
