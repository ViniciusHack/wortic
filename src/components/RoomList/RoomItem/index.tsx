import { Avatar, Badge, HStack, Link as ChakraLink, Text } from "@chakra-ui/react";
import { Player, Room } from "@prisma/client";
import Link from 'next/link';
import { RoomInfo } from "./RoomInfo";

// type RoomItemProps = Omit<Room, "current_word" | "all_words" | "updated_at">

// stats, reset_hour, official
export function RoomItem({ id, name, image_url, owner }: (Room & {
  owner: Player;
})) {
  console.log({image_url})
  return (
    <Link href={`/room/${id}`}>
      <ChakraLink
        bgColor="gray.600"
        p="4"
        pt="8"
        rounded="lg"
        transitionDuration="200ms"
        position="relative"
        textAlign="center"
        _hover={{ bgColor: "gray.800" }}
      >
        <HStack position="absolute" top="2" right="2">
          <Badge colorScheme="red">New</Badge>
          <Badge colorScheme="orange">Hot</Badge>
          {/* {official && <Badge colorScheme="blue">Official</Badge>} */}
        </HStack>

        <Avatar size="2xl" src={image_url!}/>
        <Text fontSize="3xl">{name}</Text>

        <RoomInfo 
          // stats={stats}
          owner={owner}
          // reset_hour={reset_hour}
        />
      </ChakraLink>
    </Link>
  )
}