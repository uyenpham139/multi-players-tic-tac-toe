import { calculateWinner } from "./gameLogic"

let steps = 0;

export const minimaxWithDepthLimit = (board: (string|null)[], depth: number, isMaximizing: boolean, alpha: number, beta: number, maxDepth: number) => {
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
        const evalScore = minimaxWithDepthLimit(newBoard, depth + 1, false, alpha, beta, maxDepth);
        maxEval = Math.max(maxEval, evalScore);
        alpha = Math.max(alpha, evalScore);
        if (beta <= alpha) break;
      }
    }
    return maxEval;
  } else { // Player turn
    let minEval = Infinity;
    for (let i = 0; i < board.length; i++) {
      if (!board[i]) {
        const newBoard = [...board];
        newBoard[i] = "X";
        const evalScore = minimaxWithDepthLimit(newBoard, depth + 1, true, alpha, beta, maxDepth);
        minEval = Math.min(minEval, evalScore);
        beta = Math.min(beta, evalScore);
        if (beta <= alpha) break;
      }
    }
    return minEval;
  }
}

export const resetSteps = () => { steps = 0; };
export const getSteps = () => steps;