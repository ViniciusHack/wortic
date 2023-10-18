import { Box, Button, Flex, FormControl, FormErrorMessage, FormHelperText, FormLabel, HStack, Input, Radio, RadioGroup, Tag, TagLabel, TagLeftIcon, VStack } from "@chakra-ui/react";
import { RoomWord, WordLevel } from "@prisma/client";
import { X } from "phosphor-react";
import { useState } from "react";
import { getColorBywordLevel } from "../../../utils/colors";

interface WordSubmittingInterface {
  words: Omit<RoomWord, "roomId">[];
  addNewWord: (word: Omit<RoomWord, "roomId">, setError: (err: {field: string, message: string}) => void) => void;
  removeWord: (name: string) => void;
}

export function WordSubmitting({ addNewWord, removeWord, words }: WordSubmittingInterface) {
  const [wordLevel, setWordLevel] = useState<WordLevel>("EASY");
  const [wordName, setWordName] = useState("");
  const [error, setError] = useState({ field: "", message: "" });
  
  return (
    <Flex w="100%" gap="8">
      <Box>
        <FormControl flex="1" >
          <FormLabel htmlFor="word_name">Palavras*</FormLabel>
          <VStack spacing="4">
            <FormControl isInvalid={!!error.message}>
              <Input 
                type="text" 
                id="word_name" 
                // maxLength={16}
                minLength={2}
                placeholder="Steve" 
                value={wordName} 
                onChange={(e) => setWordName(e.target.value)} 
              />
              <FormErrorMessage>{error.message}</FormErrorMessage>
            </FormControl>
            <RadioGroup>
              <HStack spacing="4">
                <Radio value="EASY" onChange={(e) => setWordLevel(e.target.value as WordLevel)}>Fácil</Radio>
                <Radio value="MEDIUM" onChange={(e) => setWordLevel(e.target.value as WordLevel)}>Médio</Radio>
                <Radio value="HARD" onChange={(e) => setWordLevel(e.target.value as WordLevel)}>Difícil</Radio>
                <Radio value="EXTREME" onChange={(e) => setWordLevel(e.target.value as WordLevel)}>Muito difiícil</Radio>
              </HStack>
            </RadioGroup>
          </VStack>

          <Button mt="2" size="sm" colorScheme="purple" onClick={() => {
            addNewWord({ content: wordName, level: wordLevel }, setError), setWordName("")
          }}>
            Registrar palavra
          </Button>
          
          <FormHelperText>Aqui é onde você deve registrar suas palavras</FormHelperText>
        </FormControl>
      </Box>

      <Box bgColor="gray.900" maxH="60" overflow="auto" flex="1" rounded="2xl" p="4">
        <Flex gap="4" wrap="wrap">
          {words.map(word => (
            <Tag key={word.content} colorScheme={getColorBywordLevel(word.level)}>
              <TagLeftIcon as={X} cursor="pointer" onClick={() => removeWord(word.content)}/>
              <TagLabel wordBreak="break-all">{word.content}</TagLabel>
            </Tag>
          ))}
        </Flex>
      </Box>
    </Flex>
  )
}