import { extendTheme } from "@chakra-ui/react";


export const theme = extendTheme({
  fonts: {
    heading: 'Quicksand',
    body: 'Quicksand'  
  },
  colors: {
    blue: {
      1000: "#1E293B"
    },
    gray: {
      450: "#475569",
      650: "#334155",
    }
  },
  styles: {
    global: {
      body: {
        color: 'gray.50',
        bgImage: "/background.png"
      }
    }
  }
})