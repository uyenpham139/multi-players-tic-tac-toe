import { minimaxWithDepthLimit, resetSteps } from "./ai";

let thinkingTime = 0;

export const calculateWinner = (squares: (string|null)[]) => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (const [a, b, c] of lines) {
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) {
      return squares[a];
    }
  }

  if (!squares.includes(null)) {
    return 'Draw';
  }

  return null;
};

export const getRandomMove = (board: (string | null)[]) => {
  const availableMoves = board
    .map((val, index) => (val === null ? index : null))
    .filter((v) : v is number => v !== null);
  
  if (availableMoves.length === 0) return null;

  const index = Math.floor(Math.random() * availableMoves.length);
  return availableMoves[index];
}

export const getBestMove = (board: (string|null)[], maxDepth: number) => {
  resetSteps();

  const startTime = performance.now();

  let bestScore = -Infinity;
  let move = null;

  for (let i = 0; i < board.length; i++) {
    if (!board[i]) {
      const newBoard = [...board];
      newBoard[i] = "O";
      const score = minimaxWithDepthLimit(newBoard, 0, false, -Infinity, Infinity, maxDepth);
      if (score > bestScore) { 
        bestScore = score;
        move = i;
      }
    }
  }
  
  const endTime = performance.now(); // end timing
  thinkingTime = endTime - startTime; // milliseconds
  
  return move;
}

export const getAIMove = (
  board: (string | null)[],
  difficulty: string
): number | null => {
  switch (difficulty) {
    case "easy":
      return getRandomMove(board);
    case "hard":
      return getBestMove(board, 4);
    case "challenge":
    default:
      return getBestMove(board, 9);
  }
};

export const getThinkingTime = () => Math.round(thinkingTime * 100) / 100;