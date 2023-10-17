import { Button, Center, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, Text } from "@chakra-ui/react";

interface ModalReportWordProps {
  onClose: () => void
}

export function ModalReportWord({ onClose }: ModalReportWordProps) {

  function reportWord() {
    return onClose()
  }

  return ( 
    <ModalContent bgColor="gray.800">
      <ModalHeader>
        <Center>
          <Text fontSize="2xl font-bold">Reportar palavra</Text>
        </Center>
        <ModalCloseButton />
      </ModalHeader>
      <ModalBody pb="4">
        <Text>
          Em caso da palavra, ser inapropriada (ofensiva, preconceituosa, apologista e etc.), você deve e pode reportá-la. Denúncias falsas estão sujeitas à punições.
        </Text>
      </ModalBody>
      <ModalFooter alignItems="center" justifyContent="center">
        <Button onClick={reportWord} colorScheme="purple">
          Confirmar
        </Button>
      </ModalFooter>
    </ModalContent>
  )
}