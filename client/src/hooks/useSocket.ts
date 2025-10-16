import { useEffect, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { handleServerMessage, type ServerMessage } from "../utils/helpers";

export function useSocket(roomId: string) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [player, setPlayer] = useState<"ODD" | "EVEN" | "SPECTATOR" | null>(null);
  const [board, setBoard] = useState<number[]>(Array(25).fill(0));

  // Initialize socket connection
  useEffect(() => {
    const socketInstance = io("http://localhost:3000");

    socketInstance.on("connect", () => {
      setConnected(true);
      socketInstance.emit("join_room", { roomId });
    });

    socketInstance.on("disconnect", () => setConnected(false));

    // Handle messages from server
    socketInstance.on("message", (msg: ServerMessage) => {
      handleServerMessage(msg, setPlayer, setBoard);
    });

    setSocket(socketInstance);

    // Cleanup
    return () => {
      socketInstance.disconnect();
    };
  }, [roomId]);

  // Function to send increment operation
  const sendIncrement = useCallback(
    (squareIndex: number, amount: number = 1) => {
      if (socket && connected) {
        socket.emit("message", {
          type: "INCREMENT",
          square: squareIndex,
          roomId,
          amount,
        });
      }
    },
    [socket, connected, roomId]
  );

  return { socket, connected, player, board, sendIncrement };
}
