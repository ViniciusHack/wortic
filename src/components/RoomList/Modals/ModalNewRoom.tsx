import { Button, FormControl, FormErrorMessage, FormLabel, Input, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, Text, useToast, VStack } from "@chakra-ui/react";
import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from "react";
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { IWord } from "../../../types";
import { WordSubmitting } from "../Form/WordSubmitting";

interface IFormInputs {
  name: string;
  image_url: string;
}

const schema = yup.object({
  name: yup.string().required("The name field is required").max(50),
  image_url: yup.string().url("The field value must be a url").required("The image url field is required"),
}).required();

export function ModalNewRoom() {
  const [words, setWords] = useState<IWord[]>([]);
  const toast = useToast();

  const { register, handleSubmit, formState: { errors } } = useForm<IFormInputs>({
    resolver: yupResolver(schema)
  });

  const onSubmit = (data: IFormInputs) => {
    if(words.length < 5) {
      return toast({
        title: "Failed",
        description: "You must provide at least 5 words",
        status: "error",
        position: "top-right",
        isClosable: true
      })
    }
    console.log({data: {...data, words}});

    toast({
      title: "Created",
      description: "You have created a new room",
      status: "success",
      isClosable: true
    })
  }

  const addNewWord = (word: IWord, setError: (err: {field: string, message: string}) => void) => {
    if(word.name.length > 16) return setError({ field: "name", message: "Too long"});
    if(words.find(wordState => wordState.name === word.name)) return setError({ field: "name", message: "You cannot create duplicated words"})
    setError({field: "", message: ""});
    setWords([...words, word]);
  }

  const removeWord = (name: string) => {
    setWords(
      words.filter(word => word.name !== name)
    )
  }

  return (
    <ModalContent bgColor="gray.800">
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalHeader>
          <Text fontSize="3xl">Room creation</Text>
          <ModalCloseButton />
        </ModalHeader>

        <ModalBody>
            <VStack spacing="4">
              <FormControl isInvalid={!!errors.name}>
                <FormLabel htmlFor="name">Name</FormLabel>
                <Input type="text" id="name" placeholder="Stranger Things" {...register("name")} />
                <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
              </FormControl>

              <FormControl  isInvalid={!!errors.image_url}>
                <FormLabel htmlFor="image_url">Image URL</FormLabel>
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
          <Button colorScheme="blue" w="100%" type="submit">Create</Button>
        </ModalFooter>
      </form>
    </ModalContent>
  )
}