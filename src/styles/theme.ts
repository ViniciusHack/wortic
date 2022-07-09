import { extendTheme } from "@chakra-ui/react";


export const theme = extendTheme({
  fonts: {
    heading: 'Quicksand',
    body: 'Quicksand'  
  },
  styles: {
    global: {
      body: {
        bg: 'gray.900',
        color: 'gray.50'
      }
    }
  }
})