import { Button, ModalBody, ModalCloseButton, ModalContent, ModalHeader, Text } from "@chakra-ui/react";

interface ModalInfoProps {
  onClose: () => void
}

export function ModalInfo({ onClose }: ModalInfoProps) {

  function reportWord() {
    return onClose()
  }

  return ( 
    <ModalContent bgColor="gray.800">
      <ModalHeader>
        <Button onClick={reportWord} colorScheme="purple">
          Como jogar?
        </Button>
        <ModalCloseButton />
      </ModalHeader>
      <ModalBody pb="4">
        <Text>
        Wortic é um jogo inspirado nos clássicos Wordle e Gartic. Enquanto um jogador escolhe uma palavra, os outros tentam adivinhá-la.
        </Text>
      </ModalBody>
      {/* <ModalFooter>
        <Button colorScheme="cyan">Confirm</Button>
      </ModalFooter> */}
    </ModalContent>
  )
}