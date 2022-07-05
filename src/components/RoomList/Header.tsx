/* eslint-disable react/no-children-prop */
import { Badge, Box, Button, ButtonGroup, Flex, HStack, Input, InputGroup, InputLeftElement, Modal, ModalOverlay, Spacer } from "@chakra-ui/react";
import { MagnifyingGlass } from "phosphor-react";
import { useState } from "react";
import { FaPlusCircle } from "react-icons/fa";
import { IFilter, TagValue } from "../../pages";
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
          New room
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
        <Button onClick={() => setIsModalLoginOpen(true)}>Log in</Button>
        {/* <Button onClick={() => setIsModalOpen(true)} variant="outline">Sign Up</Button> */}
      </ButtonGroup>
      <Modal isOpen={isModalLoginOpen} onClose={() => setIsModalLoginOpen(false)} isCentered> {/*isCentered, motionPreset backdropFilters*/}
        <ModalOverlay backdropFilter="blur(6px)"/>
        <ModalLogin />
      </Modal>
      <Modal isOpen={isModalNewRoomOpen} onClose={() => setIsModalNewRoomOpen(false)} size="4xl">
        <ModalOverlay />
        <ModalNewRoom />
      </Modal>
    </Flex>
  )
}