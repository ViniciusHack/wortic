import { Button, Flex, FormControl, FormErrorMessage, FormLabel, Input, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, Text, useToast, VStack } from "@chakra-ui/react";
import { zodResolver } from '@hookform/resolvers/zod';
import { RoomWord } from "@prisma/client";
import { useState } from "react";
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { api } from "../../../shared/services/api";
import { WordSubmitting } from "../Form/WordSubmitting";

interface ModalNewRoomProps {
  onCreated: () => void;
}

export const createRoomSchemaBody = z.object({
  name: z.string().max(50),
  winnerScore: z.number().min(30).max(1000).optional(),
  gameTime: z.number().min(10).max(1000).optional(),
  image_url: z.string().optional() //.url()
})

type IFormInputs = z.infer<typeof createRoomSchemaBody>

export function ModalNewRoom({ onCreated }: ModalNewRoomProps) {
  const [words, setWords] = useState<Omit<RoomWord, "roomId">[]>([]);
  const toast = useToast();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<IFormInputs>({
    resolver: zodResolver(createRoomSchemaBody)
  });

  const onSubmit = async (data: IFormInputs) => {
    if(words.length < 5) {
      return toast({
        title: "Failed",
        description: "You must provide at least 5 words",
        status: "error",
        position: "top-right",
        isClosable: true
      })
    }

    await api.post('/rooms', {...data, words})

    toast({
      title: "Created",
      description: "You have created a new room",
      status: "success",
      isClosable: true
    })
    onCreated()
  }

  const addNewWord = (wordReceived: Omit<RoomWord, "roomId">, setError: (err: {field: string, message: string}) => void) => {
    const wordsBulk = wordReceived.content.split(',')
    const wordsToSave:Omit<RoomWord, "roomId">[] = []
    wordsBulk.forEach(word => {
      if(word.trim().length > 16) return setError({ field: "name", message: "Too long"});
      if(!words.some(wordState => wordState.content.trim().toLowerCase() === word.trim().toLowerCase())) {
        setError({field: "", message: ""});
        wordsToSave.push({
          content: word.trim(),
          level: wordReceived.level
        })
      }
    })
    setWords(state => state.concat(wordsToSave));
  }

  const removeWord = (name: string) => {
    setWords(
      words.filter(word => word.content !== name)
    )
  }

  return (
    <ModalContent bgColor="gray.800">
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalHeader>
          <Text fontSize="3xl">Criação de sala</Text>
          <ModalCloseButton />
        </ModalHeader>

        <ModalBody>
            <VStack spacing="4">

            <Flex gap={4} alignItems="center" w="full">
              <FormControl isInvalid={!!errors.name}>
                <FormLabel htmlFor="name">Nome*</FormLabel>
                <Input type="text" id="name" placeholder="Stranger Things" {...register("name")} />
                <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
              </FormControl>
              
              <FormControl isInvalid={!!errors.gameTime}>
                <FormLabel htmlFor=".gameTime">Tempo por palavra</FormLabel>
                <Input type="number" id=".gameTime" placeholder="100" {...register("gameTime", {
                  valueAsNumber: true
                })} />
                <FormErrorMessage>{errors.gameTime?.message}</FormErrorMessage>
              </FormControl>

              <FormControl  isInvalid={!!errors.winnerScore}>
                <FormLabel htmlFor="winnerScore">Pontos para a vitória</FormLabel>
                <Input type="number" id="winnerScore" placeholder="150" {...register("winnerScore", {
                  valueAsNumber: true
                })} />
                <FormErrorMessage>{errors.winnerScore?.message}</FormErrorMessage>
              </FormControl>
            </Flex>

              <FormControl  isInvalid={!!errors.image_url}>
                <FormLabel htmlFor="image_url">URL da imagem</FormLabel>
                <Input type="text" id="image_url" placeholder="https://xxxxxx.xxx" {...register("image_url")} />
                <FormErrorMessage>{errors.image_url?.message}</FormErrorMessage>
              </FormControl>

              {/* <FormControl>
                <FormLabel htmlFor="reset_at">Reset time</FormLabel>
                TO DO - <CustomSelect></CustomSelect> to select a time
                <Input type="time" />
                <FormHelperText>Consider UTC time</FormHelperText>
              </FormControl> */}
              {/*TO DO - All words (word list submiting) */}
              <WordSubmitting addNewWord={addNewWord} words={words} removeWord={removeWord}/>
              
            </VStack>
        </ModalBody>

        <ModalFooter>
          <Button
            disabled={isSubmitting}
            colorScheme="blue"
            w="100%"
            type="submit"
            size="lg"
            mb="2"
          >
            Criar sala
          </Button>
        </ModalFooter>
      </form>
    </ModalContent>
  )
}