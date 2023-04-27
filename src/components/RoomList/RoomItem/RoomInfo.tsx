import { Avatar, Box, Flex, HStack, Tag, TagLabel, TagLeftIcon, Text } from "@chakra-ui/react";
import { Player } from "@prisma/client";
import { Check, Timer, X } from "phosphor-react";

// type RoomInfoProps = Pick<IRoom, "stats" | "owner" | "reset_hour">
interface RoomInfoProps {
  owner: Player;
}

export function RoomInfo({ owner }: RoomInfoProps) {
  // const hoursToResetRemaining = Math.abs(new Date().getUTCHours() - reset_hour);
  return (
    <Box>
      <HStack spacing="2" justify="center">
        <Tag colorScheme="green">
          <TagLeftIcon as={Check}/>
          <TagLabel>20</TagLabel>
        </Tag>
        <Tag colorScheme="red">
          <TagLeftIcon as={X}/>
          <TagLabel>12</TagLabel>
        </Tag>
      </HStack>
      
      <Flex align="center" justify="space-between" pt="2">
        <HStack spacing="2">
          <Avatar size="sm" src={owner.image || "../../../../public/favicon.png"} name={owner.name}/>
          <Text fontSize="sm">Criado por <Text as="span" fontWeight="bold" >{owner.name}</Text></Text>
        </HStack>

        <Tag colorScheme="yellow" >
          <TagLeftIcon as={Timer}/>
          <TagLabel>12h</TagLabel>
        </Tag>
      </Flex>
    </Box>
  )
}