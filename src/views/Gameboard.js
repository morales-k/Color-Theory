import React, { useState } from 'react'
import Canvas from './Canvas';
import SplashScreen from './SplashScreen';

function Gameboard() {
  const [start, toggleStart] = useState(false);

  return (
    <div id="gameboard">
      {
        start ? <Canvas /> : <SplashScreen toggleStart={toggleStart} />
      }
    </div>
  )
}

export default Gameboard