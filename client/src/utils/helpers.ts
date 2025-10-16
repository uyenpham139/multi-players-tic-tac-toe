type PlayerRole = "ODD" | "EVEN" | "SPECTATOR";

interface PlayerAssignedMessage {
  type: "PLAYER_ASSIGNED";
  player: PlayerRole;
  board: number[];
}

interface UpdateMessage {
  type: "UPDATE";
  square: number;
  amount: number; // ✅ changed from 'value' to 'amount'
}

interface GameOverMessage {
  type: "GAME_OVER";
  winner: PlayerRole;
  winningLine?: number[];
}

export type ServerMessage =
  | PlayerAssignedMessage
  | UpdateMessage
  | GameOverMessage;

export function handleServerMessage(
  msg: ServerMessage,
  setPlayer: (role: PlayerRole) => void,
  setBoard: React.Dispatch<React.SetStateAction<number[]>>
) {
  switch (msg.type) {
    case "PLAYER_ASSIGNED":
      setPlayer(msg.player);
      setBoard(msg.board);
      break;

    case "UPDATE":
      // Apply delta operation
      setBoard((prevBoard) => {
        const newBoard = [...prevBoard];
        newBoard[msg.square] += msg.amount; // increment/decrement relative
        return newBoard;
      });
      break;

    case "GAME_OVER":
      // alert(`Game Over! Winner: ${msg.winner}`);
      break;

    default:
      console.warn("Unknown message type:", msg);
  }
}
