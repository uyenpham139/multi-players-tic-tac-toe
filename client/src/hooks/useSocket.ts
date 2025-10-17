// useSocket.ts
import { useEffect, useState } from 'react';
import { socket } from './../utils/socket';
import { handleServerMessage, type ServerMessage } from '../utils/helpers';

export function useSocket(roomId: string) {
  const [connected, setConnected] = useState(false);
  const [player, setPlayer] = useState<"ODD" | "EVEN" | "SPECTATOR" | null>(null);
  const [board, setBoard] = useState<number[]>(Array(25).fill(0));

  useEffect(() => {
    const handleConnect = () => {
      console.log("✅ Connected:", socket.id);
      setConnected(true);
      socket.emit("get_rooms"); // fetch room list when connected
    };

    const handleDisconnect = () => {
      console.log("❌ Disconnected");
      setConnected(false);
      setPlayer(null);
      setBoard(Array(25).fill(0));
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
    };
  }, []);

  // handle incoming messages from server
  useEffect(() => {
    const handleMsg = (msg: ServerMessage) => {
      console.log("📩 Received:", msg);
      handleServerMessage(msg, setPlayer, setBoard);
    };

    socket.on("message", handleMsg);
    return () => {
      socket.off("message", handleMsg);
    };
  }, []);

  // send an increment event to the server
  const sendIncrement = (square: number, amount = 1) => {
    if (!connected) return;
    socket.emit("message", { type: "INCREMENT", roomId, square, amount });
  };

  return { socket, connected, player, board, sendIncrement };
}
