import { useState } from 'react';
import './App.css';
import GameInfo from './components/GameInfo';
import image from './assets/hero-img.png';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';

function App() {
  const [gameState, setGameState] = useState("menu");
  const [mode, setMode] = useState("");

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setMode(event.currentTarget.value);
    if(gameState === "menu") 
      setGameState("play");
  }

  const handleHomeClick = () => {
    if(gameState !== "menu") 
      setGameState("menu");
  }

  return (
    <>
      <div className='container'>
        <div className='game'>
          <button onClick={handleHomeClick} className='homeBtns'><HomeOutlinedIcon /></button>
          <h1 className='title'>TIC TAC TOE</h1>
          <div className='wrapper'>
            {gameState === "menu" ? (
            <img src={image} alt="hero-img" />) : ""}
            {gameState === "menu" ? (
              <div className='buttons'>
                <button className='modeBtns easy' value="easy" onClick={handleClick}>Easy Mode</button>
                <button className='modeBtns hard' value="hard" onClick={handleClick}>Hard Mode</button>
                <button className='modeBtns challenge' value="challenge" onClick={handleClick}>Challenge Mode</button>
              </div>
            ) : (
              <>
                <GameInfo mode={mode}/>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default App
