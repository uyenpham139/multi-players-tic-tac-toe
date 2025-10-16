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

/*
  Get all active rooms
*/
export function getActiveRooms(): Room[] {
  return Object.values(rooms);
}

/*
  Get or create a new room (Only players can create)
*/
export function getOrCreateRoom(roomId: string, isPlayer: boolean): (Room | null) {

  const activeRooms = Object.keys(rooms);

  if (!rooms[roomId] && activeRooms.length >= 5 && isPlayer) {
    return null;
  }

  if (!rooms[roomId] && !isPlayer) {
    return null;
  }

  if (!rooms[roomId]) {
    rooms[roomId] = { id: roomId, players: [], board: Array(25).fill(0) };
  }
  return rooms[roomId];
}

/*
  Add player or spectator
/*/
export function addPlayerToRoom(room: Room, socketId: string, roleChoice: "PLAYER" | "SPECTATOR"): Player | null {
  if (roleChoice === "PLAYER") {
    if (room.players.filter((p) => p.role !== "SPECTATOR").length >= 2) {
      return null;
    }

    const existingRoles = room.players.map((p) => p.role);
    const role: "ODD" | "EVEN" = existingRoles.includes("ODD") ? "EVEN" : "ODD";
    const player: Player = { id: socketId, role };
    room.players.push(player);
    return player;
  }

  const spectator: Player = { id: socketId, role: "SPECTATOR" };
  room.players.push(spectator);
  return spectator;
}

/*
  Remove room when empty
*/
export function removePlayer(socketId: string) {
  for (const [roomId, room] of Object.entries(rooms)) {
    room.players = room.players.filter((p) => p.id !== socketId);
    if (room.players.length === 0) {
      delete rooms[roomId];
    }
  }
}
