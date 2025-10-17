import { useState, useEffect } from "react";
import "./App.css";
import GameInfo from "./components/GameInfo";
import image from "./assets/hero-img.png";
import { HomeOutlined } from "@mui/icons-material";
import { useSocket } from "./hooks/useSocket";

interface RoomInfo {
  id: string;
  playerCount: number;
  spectatorCount: number;
}

function App() {
  const [gameState, setGameState] = useState<
    "menu" | "chooseRole" | "joinRoom" | "game"
  >("menu");
  const [role, setRole] = useState<"PLAYER" | "SPECTATOR" | null>(null);
  const [roomId, setRoomId] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [rooms, setRooms] = useState<RoomInfo[]>([]);

  const { socket, connected, player, board, sendIncrement } = useSocket(roomId);

  useEffect(() => {
    const handleRoomsUpdated = (updatedRooms: RoomInfo[]) => {
      setRooms(updatedRooms);
    };

    const handleErrorMsg = (msg: string) => {
      setErrorMsg(msg);
    };

    socket.on("roomsUpdated", handleRoomsUpdated);
    socket.on("errorMsg", handleErrorMsg);

    return () => {
      socket.off("roomsUpdated", handleRoomsUpdated);
      socket.off("errorMsg", handleErrorMsg);
    };
  }, [socket]);

  const handleHomeClick = () => {
    if (roomId) {
      socket.emit("leaveRoom", { roomId });
    }
    setGameState("menu");
    setRole(null);
    setRoomId("");
    setErrorMsg("");
  };

  const handleNewGameClick = () => {
    setGameState("chooseRole");
    setErrorMsg("");
  };

  const handleChooseRole = (chosenRole: "PLAYER" | "SPECTATOR") => {
    setRole(chosenRole);
    setGameState("joinRoom");
  };

  const handleCreateRoom = () => {
  if (role === "SPECTATOR") {
    setErrorMsg("Spectators cannot create rooms");
    return;
  }

  const newRoomId = `room-${Math.floor(Math.random() * 10000)}`;
    socket.emit(
      "joinRoom",
      { roomId: newRoomId, role },
      (response: { success: boolean; message?: string }) => {
        console.log("🧩 createRoom response:", response);
        if (response.success) {
          setRoomId(newRoomId);
          setGameState("game");
          setErrorMsg("");
        } else {
          setErrorMsg(response.message || "❌ Failed to create room.");
        }
      }
    );
  };

  const handleJoinRoom = (id: string) => {
    if (!role) {
      setErrorMsg("Please choose a role first.");
      return;
    }

    socket.emit(
      "joinRoom",
      { roomId: id, role },
      (response: { success: boolean; message?: string }) => {
        console.log("🧩 joinRoom response:", response);
        if (response.success) {
          setRoomId(id);
          setGameState("game");
          setErrorMsg("");
        } else {
          setErrorMsg(response.message || "❌ Failed to join room.");
        }
      }
    );
  };

  return (
    <>
      <div className='container'>
        <div className='game'>
          <div className='appBtns'>
            <button onClick={handleHomeClick} className='homeBtn'><HomeOutlined /></button>
          </div>
          <h1 className='title'>TIC TAC TOE</h1>
          <div className='wrapper'>
            {gameState === "menu" && (
              <>
                <img src={image} alt="hero-img" />
                <div className='buttons'>
                  <button className='modeBtns' value="easy" onClick={handleNewGameClick}>
                    New game
                  </button>
                </div>
              </>
            )}
            {gameState === "chooseRole" && (
              <>
                <img src={image} alt="hero-img" />
                <h2>Choose role</h2>
                <div className="buttons">
                  <button className="modeBtns" onClick={() => handleChooseRole("PLAYER")}>Player</button>
                  <button className="modeBtns" onClick={() => handleChooseRole("SPECTATOR")}>Spectator</button>
                </div>
              </>
            )}
            {gameState === "joinRoom" && (
              <>
                <div className="joinRoom">
                  <div>
                    <p className={`text ${role === "PLAYER" ? "player" : "spectator"}`}>Role: {role}</p>
                    {role === "PLAYER" ? 
                      <button className="modeBtns" onClick={() => handleCreateRoom()}>
                        Create new room
                      </button> : ""}
                    {errorMsg && <p className="error">{errorMsg}</p>}
                  </div>

                  <div className="roomList">
                    {rooms.length > 0 ? (
                      rooms.map((room) => (
                        <div key={room.id} className="roomItem">
                          <p className="roomText">Room ID: {room.id}</p>
                          <p className="roomText">Players: {room.playerCount} / 2 | Spectators:{" "}{room.spectatorCount} / 10</p>
                          <button className="joinBtn" onClick={() => handleJoinRoom(room.id)}>Join</button>
                        </div>
                      ))
                    ) : (
                      <p className="text avail">No rooms available</p>
                    )}
                  </div>
                </div>
              </>
            ) }
            {gameState === "game" && 
              <GameInfo
                roomId={roomId}
                role={role}
                socket={socket}
                connected={connected}
                player={player}
                board={board}
                sendIncrement={sendIncrement}
              />
            }
          </div>
        </div>
      </div>
    </>
  )
}

export default App
