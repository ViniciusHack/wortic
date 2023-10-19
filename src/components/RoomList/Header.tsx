/* eslint-disable react/no-children-prop */
import { Avatar, Badge, Box, Button, ButtonGroup, Flex, HStack, Input, InputGroup, InputLeftElement, Modal, ModalOverlay, Spacer, Text } from "@chakra-ui/react";
import { signOut, useSession } from "next-auth/react";
import { MagnifyingGlass } from "phosphor-react";
import { useState } from "react";
import { FaPlusCircle } from "react-icons/fa";
import { IFilter, TagValue } from "../../types";
import { ModalLogin } from "./Modals/ModalLogin";
import { ModalNewRoom } from "./Modals/ModalNewRoom";

interface HeaderProps {
  handleFilter: (filter: Partial<IFilter>) => void;
  currentFilter: IFilter;
}

const tags = [
  {
    id: 0,
    title: "all",
    color: "gray",
  },
  {
    id: 1,
    title: "new",
    color: "red",
  },
  {
    id: 2,
    title: "hot",
    color: "orange",
  },
  {
    id: 3,
    title: "official",
    color: "blue",
  }
]

export function Header({ handleFilter, currentFilter }: HeaderProps) {
  const [isModalLoginOpen, setIsModalLoginOpen] = useState(false);
  const [isModalNewRoomOpen, setIsModalNewRoomOpen] = useState(false);

  const { data } = useSession()

  return (
    <Flex as="header" align="flex-start">
      <Box>
        <InputGroup w="initial">
          <InputLeftElement children={<MagnifyingGlass size={20}/>} />
          <Input
            value={currentFilter.value}
            type="text"
            placeholder="Buscar salas"
            onChange={(e) => handleFilter({ value: e.target.value })} 
          />
        </InputGroup>
        <Button mt="2" colorScheme="purple" leftIcon={<FaPlusCircle />} onClick={() => setIsModalNewRoomOpen(true)}>
          Nova sala
        </Button>
      </Box>

      <Spacer />
      <Flex>
        <HStack spacing="4">
          {tags.map(tag => (
            <Badge
              key={tag.id}
              cursor="pointer"
              fontSize="lg"
              variant={tag.title === currentFilter.tag ? "solid" : "outline"}
              colorScheme={tag.color}
              onClick={() => handleFilter({tag: tag.title as TagValue})}
            >
              {tag.title}
            </Badge>
          ))}
        </HStack>
      </Flex>
      <Spacer />

      <ButtonGroup size="md" spacing="4" colorScheme="blue">
        {!data?.user ?
          <Button onClick={() => setIsModalLoginOpen(true)} colorScheme="purple">
            Log in
          </Button>
          : 
          <Flex gap={2} alignItems="center">
            <Avatar size="sm" src={data.user.image!}/>
            <Text fontSize="md">{data.user.name}</Text>
            <Button
              colorScheme="red"
              size="sm"
              px="2"
              ml="2"
              onClick={() => signOut()}
            >
              Sair
            </Button>
          </Flex>
        }
        {/* <Button onClick={() => setIsModalOpen(true)} variant="outline">Sign Up</Button> */}
      </ButtonGroup>
      <Modal isOpen={isModalLoginOpen} onClose={() => setIsModalLoginOpen(false)} isCentered> {/*isCentered, motionPreset backdropFilters*/}
        <ModalOverlay backdropFilter="blur(6px)"/>
        <ModalLogin />
      </Modal>
      <Modal isOpen={isModalNewRoomOpen} onClose={() => setIsModalNewRoomOpen(false)} size="4xl">
        <ModalOverlay />
        <ModalNewRoom onCreated={() => setIsModalNewRoomOpen(false)}/>
      </Modal>
    </Flex>
  )
}