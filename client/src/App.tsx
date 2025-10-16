import { useState, useEffect } from "react";
import "./App.css";
import GameInfo from "./components/GameInfo";
import image from "./assets/hero-img.png";
import { HomeOutlined } from "@mui/icons-material";

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

  // ✅ Simulated fetch for room list (replace with real API or socket later)
  useEffect(() => {
    if (gameState === "joinRoom") {
      // For now, just mock some data
      setRooms([
        { id: "room1", playerCount: 2, spectatorCount: 4 },
        { id: "room2", playerCount: 1, spectatorCount: 0 },
        { id: "room3", playerCount: 2, spectatorCount: 10 },
      ]);
    }
  }, [gameState]);

  const handleHomeClick = () => {
    setGameState("menu");
    setRole(null);
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
      setErrorMsg("Spectators cannot create new rooms.");
      return;
    }
    const newRoomId = `room-${Math.floor(Math.random() * 10000)}`;
    setRoomId(newRoomId);
    setGameState("game");
  };

  const handleJoinRoom = (id: string) => {
    if (role === "SPECTATOR") {
      const selectedRoom = rooms.find((r) => r.id === id);
      if (selectedRoom && selectedRoom.spectatorCount >= 10) {
        setErrorMsg("This room already has 10 spectators.");
        return;
      }
    } else {
      const selectedRoom = rooms.find((r) => r.id === id);
      if (selectedRoom && selectedRoom.playerCount >= 2) {
        setErrorMsg("This room is full. Please choose another.");
        return;
      }
    }
    setRoomId(id);
    setGameState("game");
  };

  return (
    <>
      <div className='container'>
        <div className='game'>
          <div className='appBtns'>
            <button onClick={handleHomeClick} className='homeBtn'><HomeOutlined /></button>
            <div className='dropdown'>
              {/* <button onClick={handleMoreClick} className='moreBtns'><MoreVertOutlined /></button>
              <div className={`dropdownMenu ${isDropdownOpen ? "active" : ""}`}>
                
              </div> */}
            </div>
          </div>
          <h1 className='title'>TIC TAC TOE</h1>
          <div className='wrapper'>
            {gameState === "menu" ? (
            ) : ""}
            {gameState === "menu" && (
              <>
                <img src={image} alt="hero-img" />
                <div className='buttons'>
                  <button className='modeBtns' value="easy" onClick={handleNewGameClick}>New game</button>
                </div>
              </>
            )}
            {gameState === "chooseRole" && (
              <>
                <img src={image} alt="hero-img" />
                <h2>Choose role</h2>
                <button className="modeBtns" onClick={() => handleChooseRole("PLAYER")}>Player</button>
                <button className="modeBtns" onClick={() => handleChooseRole("SPECTATOR")}>Spectator</button>
              </>
            )}
            {gameState === "joinRoom" && (
              <>
                <div>
                  <div>

                  </div>
                  <div>

                  </div>
                </div>
              </>
            ) }
            {(
              <>
                <GameInfo roomId='1' />
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default App
