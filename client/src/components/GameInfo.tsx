import { useState, useEffect } from "react";
import Board from "./Board";
import type { Socket } from "socket.io-client";
import type { ServerMessage } from "../utils/helpers";
import Cards from "./Card";

interface GameInfoProps {
  roomId: string;
  role: "PLAYER" | "SPECTATOR" | null;
  socket: Socket;
  connected: boolean;
  player: "SPECTATOR" | "ODD" | "EVEN" | null;
  board: number[];
  sendIncrement: (square: number, amount?: number) => void;
}

export default function GameInfo({
  roomId,
  role,
  socket,
  connected,
  player,
  board,
  sendIncrement,
}: GameInfoProps) {
  const [scores, setScores] = useState({ odd: 0, even: 0 });
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [winner, setWinner] = useState<"ODD" | "EVEN" | null>(null);
  const [resetRequestedBy, setResetRequestedBy] = useState<string | null>(null);
  const [waiting, setWaiting] = useState<boolean>(false);
  
  const resetMessage = "Opponent wants to reset the game.";

  // 🔄 Handle incoming messages from server
  useEffect(() => {
    const handleMessage = (msg: ServerMessage & { winner?: "ODD" | "EVEN" }) => {
      switch (msg.type) {
        case "STATUS":
          setStatusMessage(msg.message);
          break;

        case "RESET":
          setWinner(null);
          setStatusMessage("🔄 Board and scores reset!");
          setScores({ odd: 0, even: 0 });
          setResetRequestedBy(null);
          break;

        case "GAME_OVER":
          if (msg.winner) {
            setWinner(msg.winner);
            setStatusMessage(`🏁 Game Over! Winner: ${msg.winner}`);
            setScores((prev) => ({
              ...prev,
              [msg.winner.toLowerCase()]: prev[msg.winner.toLowerCase() as "odd" | "even"] + 1,
            }));
          }
          break;

        case "WAITING":
          setWaiting(true);
          setStatusMessage("⏳ Waiting for opponent...");
          break;

        case "CAN_PLAY":
          setWaiting(false);
          setStatusMessage("✅ Opponent joined! Play Now!");
          break;

        case "PLAYER_LEFT":
          setWaiting(true);
          setWinner(null);
          setStatusMessage("❌ Opponent disconnected. Waiting for new player...");
          setScores({ odd: 0, even: 0 });
          break;

        case "REQUEST_RESET":
          if (player !== "SPECTATOR") {
            setResetRequestedBy(msg.from);
            setStatusMessage("Your opponent wants to reset. Accept?");
          }
          break;

        case "REQUEST_CANCEL":
          setStatusMessage("❌ Opponent cancelled reset request.");
          setResetRequestedBy(null);
          break;

        case "CONTINUE":
          setWinner(null);
          setStatusMessage("✅ New round started!");
          break;

        default:
          break;
      }
    };

    socket.on("message", handleMessage);
    return () => {socket.off("message", handleMessage);}
  }, [socket, player]);

  // Request board reset
  const handleResetRequest = () => {
    if (player === "SPECTATOR") return;
    socket.emit("message", { type: "REQUEST_RESET", roomId, from: player });
    setStatusMessage("You requested to reset. Waiting for opponent...");
  };

  // Accept or Decline reset request
  const handleResetConfirm = (accept: boolean) => {
    if (!resetRequestedBy) return;
    if (accept) {
      socket.emit("message", { type: "RESET", roomId });
      setStatusMessage("✅ Game reset!");
    } else {
      socket.emit("message", { type: "REQUEST_CANCEL", roomId });
      setStatusMessage("❌ You declined reset.");
    }
    setResetRequestedBy(null);
  };

  // ▶ Continue game after win
  const handleContinue = () => {
    socket.emit("message", { type: "CONTINUE", roomId });
    setWinner(null);
    setStatusMessage("🆕 Next round!");
  };

  if (!connected) {
    return <div className="status">🔌 Connecting to {roomId}...</div>;
  }

  return (
    <div className="gameInfo">
      <p className="text bold">
        Room ID: <span className="highlight">{roomId}</span>
      </p>

      {role === "PLAYER" && (
        <p className={`roleTag ${player?.toLowerCase()}`}>
          You are: {player}
        </p>
      )}

      {role === "SPECTATOR" && <h3 className="spectating">👀 You are spectating</h3>}
      
      {statusMessage && <div className="status">{statusMessage}</div>}

      <div className="scoreboard">
        <div className="scoretext odd">ODD</div>
        <div className="scores">
          {scores.odd} <span>:</span> {scores.even}
        </div>
        <div className="scoretext even">EVEN</div>
      </div>

      <Board
        squares={board}
        handleClick={(index) => {
          if (player !== "SPECTATOR" && !winner && !waiting) sendIncrement(index);
        }}
      />

      <div className="optionBtns">
        {player !== "SPECTATOR" && (
          <>
            <button className="optionBtn" onClick={handleResetRequest}>
              Reset
            </button>
            {winner && (
              <button className="optionBtn" onClick={handleContinue}>
                Continue
              </button>
            )}
          </>
        )}
      </div>

      {resetRequestedBy && (
        <Cards message={resetMessage} handleResetConfirm={handleResetConfirm}/>
      )}
    </div>
  );
}
