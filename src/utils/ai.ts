import { calculateWinner } from "./gameLogic"

let steps = 0;

export const minimaxWithDepthLimit = (board: (string|null)[], depth: number, isMaximizing: boolean, maxDepth: number) => {
  steps++;
  
  const winner = calculateWinner(board);
  if (winner === "O") return 10 - depth;
  if (winner === "X") return -10 + depth;
  if (winner === "Draw") return 0;
  if (depth >= maxDepth) return 0;

  // AI Turn
  if (isMaximizing) {
    let maxEval = -Infinity;
    for (let i = 0; i < board.length; i++) {
      if (!board[i]) {
        const newBoard = [...board];
        newBoard[i] = "O";
        const evalScore = minimaxWithDepthLimit(newBoard, depth + 1, false, maxDepth);
        maxEval = Math.max(maxEval, evalScore);
      }
    }
    return maxEval;
  } else { // Player turn
    let minEval = Infinity;
    for (let i = 0; i < board.length; i++) {
      if (!board[i]) {
        const newBoard = [...board];
        newBoard[i] = "X";
        const evalScore = minimaxWithDepthLimit(newBoard, depth + 1, true, maxDepth);
        minEval = Math.min(minEval, evalScore);
      }
    }
    return minEval;
  }
}

export const resetSteps = () => { steps = 0; };
export const getSteps = () => steps;