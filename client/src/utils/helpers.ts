// helpers.ts
export type PlayerRole = "ODD" | "EVEN" | "SPECTATOR";

export interface PlayerAssignedMessage {
  type: "PLAYER_ASSIGNED";
  player: PlayerRole;
  board: number[];
}

export interface UpdateMessage {
  type: "UPDATE";
  square: number;
  amount: number;
}

export interface GameOverMessage {
  type: "GAME_OVER";
  winner: "ODD" | "EVEN";
  winningLine?: number[];
}

export interface ResetMessage {
  type: "RESET";
  board?: number[]; // optional, for syncing board state
}

export interface StatusMessage {
  type: "STATUS";
  message: string;
}

export interface WaitingMessage {
  type: "WAITING";
}

export interface CanPlayMessage {
  type: "CAN_PLAY";
}

export interface PlayerLeftMessage {
  type: "PLAYER_LEFT";
}

export interface RequestResetMessage {
  type: "REQUEST_RESET";
  from: string;
}

export interface RequestCancelMessage {
  type: "REQUEST_CANCEL";
}

export interface ContinueMessage {
  type: "CONTINUE";
  board?: number[];
}

// ─── Union ─────────────────────────────────────────────────
export type ServerMessage =
  | PlayerAssignedMessage
  | UpdateMessage
  | GameOverMessage
  | ResetMessage
  | StatusMessage
  | WaitingMessage
  | CanPlayMessage
  | PlayerLeftMessage
  | RequestResetMessage
  | RequestCancelMessage
  | ContinueMessage;

export function handleServerMessage(
  msg: ServerMessage,
  setPlayer: (role: PlayerRole) => void,
  setBoard: React.Dispatch<React.SetStateAction<number[]>>,
  onExtraMessage?: (msg: ServerMessage) => void
) {
  switch (msg.type) {
    case "PLAYER_ASSIGNED":
      setPlayer(msg.player);
      setBoard(msg.board);
      break;

    case "UPDATE":
      setBoard((prev) => {
        const newBoard = [...prev];
        newBoard[msg.square] += msg.amount;
        return newBoard;
      });
      break;

    // 🧹 NEW: reset and continue both clear the board
    case "RESET":
    case "CONTINUE":
      setBoard(msg.board ?? Array(25).fill(0));
      break;

    default:
      // delegate GAME_OVER, STATUS, etc. to GameInfo
      if (onExtraMessage) onExtraMessage(msg);
      break;
  }
}
