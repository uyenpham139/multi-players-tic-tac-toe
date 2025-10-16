import { useState } from "react";
import Board from "./Board";
import { useSocket } from "../hooks/useSocket";

export default function GameInfo({ roomId }: { roomId: string }) {

  const [scores, setScores] = useState({player: 0, ai: 0})
  // const [winner, setWinner] = useState<(string | null)>(null)

  const { socket, connected, player, board, sendIncrement } = useSocket(roomId);

  if (!connected) return <div>Connecting...</div>

  // const handleContinue = () => {
  //   setWinner(null);
  //   setPlayerNext(true);
  //   setSquares(Array(9).fill(null));
  // }

  // const handleReset = () => {
  //   setWinner(null);
  //   setPlayerNext(true);
  //   setSquares(Array(9).fill(null));
  //   setScores({player: 0, ai: 0});
  // }

  return(
    <>
      <div>
        <div>
          <h2>You are {player}</h2>
        </div>
        <div className="scoreboard">
          <div className="scoretext player">Player</div>
          <div className="scores">
            {scores.player} <span>:</span> {scores.ai}
          </div>
          <div className="scoretext ai">AI</div>
        </div>
        <Board squares={board} handleClick={sendIncrement} />
        <div className="optionBtns">
          {/* {winner ? (
            <>
              <button className="optionBtn" onClick={handleContinue}>Continnue</button>
            </>
          ) : ""} */}
          {/* <button className="optionBtn" onClick={handleReset}>Reset</button> */}
        </div>
      </div>
    </>
  );
}