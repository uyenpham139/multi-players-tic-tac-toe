import { useState, useEffect } from "react";
import Board from "./Board";
import type { Socket } from "socket.io-client";

interface GameInfoProps {
  roomId: string;
  role: "PLAYER" | "SPECTATOR" | null,
  socket: Socket,
  connected: boolean;
  player: "ODD" | "EVEN" | "SPECTATOR" | null;
  board: number[];
  sendIncrement: (square: number, amount?: number) => void;
}

export default function GameInfo({ roomId, role, socket, connected, player, board, sendIncrement }: GameInfoProps) {
  const [scores, setScores] = useState({ odd: 0, even: 0 });
  const [statusMessage, setStatusMessage] = useState<string>("");

  useEffect(() => {
    // Listen for optional server messages (like STATUS, RESET, etc.)
    socket.on("message", (msg) => {
      if (msg.type === "STATUS") {
        setStatusMessage(msg.message);
      } else if (msg.type === "RESET") {
        setStatusMessage("The board was reset!");
        setScores({ odd: 0, even: 0 });
      }
    });

    return () => {
      socket.off("message");
    };
  }, [socket]);

  const handleReset = () => {
    if (socket && player !== "SPECTATOR") {
      socket.emit("message", { type: "RESET", roomId });
    }
  };

  // update scores when board changes
  useEffect(() => {
    const oddTotal = board.filter((v) => v % 2 !== 0).length;
    const evenTotal = board.filter((v) => v % 2 === 0 && v !== 0).length;
    setScores({ odd: oddTotal, even: evenTotal });
  }, [board]);

  if (!connected) return <div>Connecting to room {roomId}...</div>;

  return (
    <div className="gameInfo">
      <h2>Room ID: {roomId}</h2>
      {role === "PLAYER" && (
        <h3>
          You are:{" "}
          <span className={``}>
            {player}
          </span>
        </h3>
      )}

      <div className="scoreboard">
        <div className="scoretext player">ODD</div>
        <div className="scores">
          {scores.odd} <span>:</span> {scores.even}
        </div>
        <div className="scoretext ai">EVEN</div>
      </div>

      <Board
        squares={board}
        handleClick={(index) => {
          if (player !== "SPECTATOR") sendIncrement(index);
        }}
      />

      <div className="optionBtns">
        {player !== "SPECTATOR" && (
          <button className="optionBtn" onClick={handleReset}>
            Reset
          </button>
        )}
      </div>

      {statusMessage && <div className="status">{statusMessage}</div>}
    </div>
  );
}
