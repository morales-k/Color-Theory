import React, { useState, useEffect } from 'react'
import Canvas from './Canvas';
import SplashScreen from './SplashScreen';

function Gameboard() {
  const [start, toggleStart] = useState(false);

  // Hide cursor when the game begins.
  useEffect(() => {
    const body = document.getElementsByTagName('body');
    
    if (start) {
      body[0].style.cursor = "none";
    } else {
      body[0].style.cursor = "";
    }
  }, [start]);

  return (
    <div id="gameboard">
      {
        start ? <Canvas /> : <SplashScreen toggleStart={toggleStart} />
      }
    </div>
  )
}

export default Gameboard