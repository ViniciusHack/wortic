import { Box, Flex, Grid, Input } from "@chakra-ui/react";
import { KeyboardEvent, memo, useEffect, useRef, useState } from "react";
import { getSocket } from "../../shared/services/socket";

interface WordBoardProps {
  lettersQuantity: number;
}

interface Attempt {
  value: string,
  disabled: boolean,
  id: number,
  inputs: {
    letter: string,
    id: number,
    rightPlace: boolean | null
  }[]
}

const Component = ({ lettersQuantity }: WordBoardProps) => {
  const firstInput = useRef<HTMLInputElement>(null);
  const [attempts, setAttempts] = useState<Attempt[]>(new Array(6).fill(null).map((_, index) => {
    return {
      value: "",
      id: Math.round(Math.random() * 10000000),
      disabled: index > 0,
      inputs: new Array(lettersQuantity).fill(null).map(() => {
        return {
          id: Math.round(Math.random() * 10000000),
          letter: "",
          rightPlace: null,
        }
      })
    }
  }));

  const currentAttempt = attempts.find(attempt => !attempt.disabled)!
  const currentAttemptIndex = attempts.findIndex(attempt => !attempt.disabled)!

  useEffect(() => {
    setAttempts(new Array(6).fill(null).map((_, index) => {
      return {
        value: "",
        id: Math.round(Math.random() * 10000000),
        disabled: index > 0,
        inputs: new Array(lettersQuantity).fill(null).map(() => {
          return {
            id: Math.round(Math.random() * 10000000),
            letter: "",
            rightPlace: null,
          }
        })
      }
    }))
  }, [lettersQuantity])

  const handleKeyDown = (
    e: KeyboardEvent<HTMLInputElement>,
    inputIndex: number,
  ) => {
    e.preventDefault();
    const newAttempts = [...attempts];
    const inputToUpdate = currentAttempt.inputs[inputIndex]
    const { key } = e;
    const nextInput = e?.currentTarget.nextElementSibling as HTMLInputElement;
    const prevInput = e?.currentTarget
      .previousElementSibling as HTMLInputElement;

    if (key === "Enter") {
      const canBeSubmitted = currentAttempt!.inputs.every(
        (input) => input.letter
      );
      if (canBeSubmitted) {
        handleSubmit();
      }
    }

    if (
      !key.match(/^[a-zA-Z0-9]$/) &&
      key !== "Backspace" &&
      key !== "ArrowLeft" &&
      key !== "ArrowRight"
    )
      return e.preventDefault();

    const newInput = {
      ...inputToUpdate,
      letter: key,
    };

    switch (key) {
      case "Backspace":
        if(!inputToUpdate.letter) {
          currentAttempt!.inputs.splice(inputIndex -1, 1, {
            ...currentAttempt.inputs[inputIndex -1],
            letter: ''
          });
          currentAttempt!.inputs.splice(inputIndex, 1, newInput);
          newAttempts.splice(currentAttemptIndex, 1, currentAttempt!);
      
          setAttempts(newAttempts);
          prevInput?.focus();
        }
        newInput.letter = "";
        break;
      case "ArrowLeft":
        prevInput?.focus();
        newInput.letter = inputToUpdate!.letter;
        break;
      case "ArrowRight":
        nextInput?.focus();
        newInput.letter = inputToUpdate!.letter;
      default:
        nextInput?.focus();
    }

    currentAttempt!.inputs.splice(inputIndex, 1, newInput);
    newAttempts.splice(currentAttemptIndex, 1, currentAttempt!);

    setAttempts(newAttempts);
  };

  const handleSubmit = async () => {
    let word = "";

    currentAttempt.inputs.forEach((input) => {
      word = word.concat(input.letter.toLowerCase());
    });

    const socket = await getSocket()

    currentAttempt.value = word,
    socket.emit("send_word", word)
  };

  useEffect(() => {
    firstInput.current?.focus();
  }, [firstInput]);

  useEffect(() => {
    async function listen(){
      const socket = await getSocket()
      function handleWordResponse(positions: { letter: string, rightPlace: boolean }[]) {
        const hit = positions.every(position => position.rightPlace)
        let nextAttemptIndex = -1
        setAttempts(state => {
          return state.map((attempt, attemptIndex) => {
            if(!attempt.disabled && attempt.value) {
              nextAttemptIndex = attemptIndex + 1
              return {
                ...attempt,
                disabled: true,
                inputs: attempt.inputs.map((input, index) => {
                  return {
                    ...input,
                    rightPlace: positions[index].rightPlace
                  }
                }),
              }
            } else if (nextAttemptIndex === attemptIndex && !hit) {
              console.log({attempt})
              return {
                ...attempt,
                disabled: false,
              }
            }
            return attempt
          })
        })
      }
  
      socket.off("word_response", handleWordResponse);
      socket.on("word_response", handleWordResponse);
  
      return () => {
        socket.off("word_response", handleWordResponse);
      }
    }
    listen()
  }, [])
  
  return (
    <Box>
      <Grid placeItems="center">
        {attempts.map((attempt) => 
          (
            <Flex key={attempt.id} gap={2} pb={2}>
              {attempt.inputs.map((input, inputIndex) => (
                <Input
                  w="42px"
                  h="42px"
                  fontWeight={700}
                  border={0}
                  outline="none"
                  rounded="0.5rem"
                  fontSize="1.5rem"
                  lineHeight="1.875rem"
                  opacity={1}
                  p={0}
                  textAlign="center"
                  textTransform="uppercase"
                  css={{
                    caretColor: "transparent",
                  }}
                  _focus={{
                    bg: "gray.500"
                  }}
                  _disabled={{
                    opacity: 1
                  }}
                  bg={
                    input.rightPlace
                      ? "green.400"
                      : input.rightPlace === false
                      ? "yellow.400"
                      : !attempt.value ? attempt.disabled ? "gray.450" : "gray.650" : "gray.650"
                  }
                  onKeyDown={(e) => handleKeyDown(e, inputIndex)}
                  key={input.id}
                  value={input.letter}
                  ref={inputIndex === 0 && !attempt.disabled ? firstInput : undefined}
                  isDisabled={attempt.disabled}
                  maxLength={1}
                  isReadOnly={
                    input.rightPlace || !attempt.value || attempt.disabled
                  }
                  isInvalid={attempt.disabled && !input.rightPlace}
                />
              ))}
            </Flex>
          )
        )}
      </Grid>
    </Box>
  );
}

export const WordBoard = memo(Component)