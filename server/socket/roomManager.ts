interface Player {
  id: string;
  role: "ODD" | "EVEN" | "SPECTATOR";
}

interface Room {
  id: string;
  players: Player[];
  board: number[];
}

const rooms: Record<string, Room> = {};

export function getOrCreateRoom(roomId: string): (Room | null) {

  const activeRooms = Object.keys(rooms);

  if (!rooms[roomId] && activeRooms.length >= 5) {
    return null;
  }

  if (!rooms[roomId]) {
    rooms[roomId] = { id: roomId, players: [], board: Array(25).fill(0) };
  }
  return rooms[roomId];
}

export function addPlayerToRoom(room: Room, socketId: string): Player {
  if (room.players.length < 2) {
    const role = room.players.length === 0 ? "ODD" : "EVEN";
    const player: Player = { id: socketId, role };
    room.players.push(player);
    return player;
  }
  const spectator: Player = { id: socketId, role: "SPECTATOR" };
  room.players.push(spectator);
  return spectator;
}
