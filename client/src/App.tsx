import { useState } from 'react';
import './App.css';
import GameInfo from './components/GameInfo';
import image from './assets/hero-img.png';
import { HomeOutlined, MoreVertOutlined } from '@mui/icons-material';

function App() {
  const [gameState, setGameState] = useState("menu");
  const [roomId, setRoomId] = useState<string>("");
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const handleClick = () => {
    if(gameState === "menu") 
      setGameState("play");
    setErrorMsg("");
  }

  const handleHomeClick = () => {
    if(gameState !== "menu") 
      setGameState("menu");
    setErrorMsg("");
  }

  const handleMoreClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation(); // prevent global click from closing immediately
    setIsDropdownOpen((prev) => !prev);
  };

  return (
    <>
      <div className='container'>
        <div className='game'>
          <div className='appBtns'>
            <button onClick={handleHomeClick} className='homeBtn'><HomeOutlined /></button>
            <div className='dropdown'>
              <button onClick={handleMoreClick} className='moreBtns'><MoreVertOutlined /></button>
              <div className={`dropdownMenu ${isDropdownOpen ? "active" : ""}`}>
                
              </div>
            </div>
          </div>
          <h1 className='title'>TIC TAC TOE</h1>
          <div className='wrapper'>
            {gameState === "menu" ? (
            <img src={image} alt="hero-img" />) : ""}
            {gameState === "menu" ? (
              <div className='buttons'>
                <button className='modeBtns' value="easy" onClick={handleClick}>New game</button>
              </div>
            ) : (
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
