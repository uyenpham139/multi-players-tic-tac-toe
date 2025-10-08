import { useEffect, useState } from "react";
import Board from "./Board";
import { calculateWinner, getAIMove } from "../utils/gameLogic";
import { getSteps, resetSteps } from "../utils/ai";

interface GameInfoProps {
  mode: string,
}

export default function GameInfo({ mode }: GameInfoProps) {
  const [squares, setSquares] = useState<(string | null)[]>(Array(9).fill(null));
  const [playerNext, setPlayerNext] = useState<boolean>(true);
  const [scores, setScores] = useState({player: 0, ai: 0})
  const [winner, setWinner] = useState<(string | null)>(null)

  useEffect(() => {
    // AI turn
    if (!playerNext && !winner) {
      const timer = setTimeout(() => {
        const moveIndex = getAIMove(squares, mode);
        if (moveIndex !== null) {
          const newSquares = [...squares];
          newSquares[moveIndex] = "O";
          setSquares(newSquares);
          setPlayerNext(true);
        }
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [mode, playerNext, squares, winner])

  // Find winner
  useEffect(() => {
    setWinner(calculateWinner(squares));
    console.log("Steps: ", getSteps())
    resetSteps();
  }, [squares]);

  useEffect(() => {
    if (winner === "X") {
      setScores(prev => ({ ...prev, player: prev.player + 1 }));
    } else if (winner === "O") {
      setScores(prev => ({ ...prev, ai: prev.ai + 1 }));
    }
  }, [winner]);

  const handleClick = (index: number) => {
    if(winner || squares[index] || !playerNext) 
      return;

    squares[index] = "X";
    setPlayerNext(!playerNext);
    setSquares([...squares])
  }

  const handleContinue = () => {
    setWinner(null);
    setPlayerNext(true);
    setSquares(Array(9).fill(null));
  }

  const handleReset = () => {
    setWinner(null);
    setPlayerNext(true);
    setSquares(Array(9).fill(null));
    setScores({player: 0, ai: 0});
  }

  return(
    <>
      <div>
        <div>
          {!winner ? (
            playerNext ? (
              <h2 className="player-text">Your turn!</h2>
            ) : (
              <h2 className="ai-text">AI's turn!</h2>
            )
          ) : winner === "X" ? (
            <h2 className="player-text">You win!</h2>
          ) : winner === "O" ? (
            <h2 className="ai-text">AI wins!</h2>
          ) : (
            <h2 className="draw-text">Draw!</h2>
          )}
        </div>
        <div className="scoreboard">
          <div className="scoretext player">Player</div>
          <div className="scores">
            {scores.player} <span>:</span> {scores.ai}
          </div>
          <div className="scoretext ai">AI</div>
        </div>
        <Board squares={squares} handleClick={handleClick} />
        <div className="optionBtns">
          {winner ? (
            <>
              <button className="optionBtn" onClick={handleContinue}>Continnue</button>
            </>
          ) : ""}
          <button className="optionBtn" onClick={handleReset}>Reset</button>
        </div>
      </div>
    </>
  );
}