import React from 'react'

function SplashScreen(props) {
  return (
    <div className="splash-container">
      <h1>Color Theory</h1>
      <button className="start-btn" onClick={() => props.toggleStart(true)}>Start</button>
    </div>
  )
}

export default SplashScreen