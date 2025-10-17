import { useEffect, useState } from 'react';
import { socket } from './../utils/socket';
import { handleServerMessage, type ServerMessage } from '../utils/helpers';

export function useSocket(roomId: string) {
  const [connected, setConnected] = useState(false);
  const [player, setPlayer] = useState<"ODD" | "EVEN" | "SPECTATOR" | null>(null);
  const [board, setBoard] = useState<number[]>(Array(25).fill(0));

  useEffect(() => {
    socket.on("connect", () => {
      console.log("✅ Connected:", socket.id);
      setConnected(true);
      socket.emit("get_rooms");
    });

    socket.on("disconnect", () => setConnected(false));

    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);

  useEffect(() => {
    const handleMsg = (msg: ServerMessage) => {
      handleServerMessage(msg, setPlayer, setBoard);
    };

    socket.on("message", handleMsg);
    return () => {socket.off("message", handleMsg);}
  }, [roomId]);

  const sendIncrement = (square: number, amount: number = 1) => {
    if (connected) {
      socket.emit("message", { type: "INCREMENT", square, roomId, amount });
    }
  };

  return { socket, connected, player, board, sendIncrement };
}
