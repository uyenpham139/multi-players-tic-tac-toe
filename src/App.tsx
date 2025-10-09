import { useState } from 'react';
import './App.css';
import GameInfo from './components/GameInfo';
import image from './assets/hero-img.png';
import { HomeOutlined, MoreVertOutlined } from '@mui/icons-material';

function App() {
  const [gameState, setGameState] = useState("menu");
  const [mode, setMode] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [showPerformance, setShowPerformance] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setMode(event.currentTarget.value);
    if(gameState === "menu") 
      setGameState("play");
    setErrorMsg("");
  }

  const handleHomeClick = () => {
    if(gameState !== "menu") 
      setGameState("menu");
    setErrorMsg("");
    setShowPerformance(false);
  }

  const handleMoreClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation(); // prevent global click from closing immediately
    setIsDropdownOpen((prev) => !prev);
  };

  const handleSwitchChange = () => {
    if (mode === "hard" || mode === "challenge") {
      setShowPerformance((prev) => !prev);
      setErrorMsg("");
    } else {
      setErrorMsg("*Only Hard or Challenge mode can enable this.");
    }
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
                <div className='toggle'>
                  <p>AI performance: </p> 
                  <label className='switch'>
                    <input 
                      type="checkbox" 
                      checked={showPerformance}
                      onChange={handleSwitchChange}
                    />
                    <div className='slider'></div>
                  </label>
                </div>
                {showPerformance ? '' : <p className='errorText'>{errorMsg} </p> }
              </div>
            </div>
          </div>
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
                <GameInfo mode={mode} showPerformance={showPerformance} />
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default App
