
import { WordLevel } from '@prisma/client';

export function getColorBywordLevel(wordLevel: WordLevel) {
  switch (wordLevel) {
    case "EASY":
      return "green";
    case "MEDIUM":
      return "yellow";
    case "HARD":
      return "orange";
    case "EXTREME":
      return "red";
  }
}