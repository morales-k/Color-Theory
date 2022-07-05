import React from 'react'

function Dialog(props) {
  return (
    <div className="dialog-container">
      <div className="dialog">
        {
          props.win && !props.showDialog ? 
          <>
          <h1 className="replay">You found all the colors!</h1>
          <button className="replay-btn" onClick={() => props.resetGame()}>Play Again</button>
          </> :
          <>
          <button className="close-btn" onClick={() => {props.toggleDialog(false)}}>X</button>
          <section>
            <h1>How to Play</h1>
            <p>Starting with primary colors, select two available colors. If the selected colors can be mixed to create a new color, the new color will be displayed. Mix all the primary colors to create all of the secondary colors, and mix all secondary colors to create all tertiary colors.</p>
          </section>
          <section>
            <h1>About Colors</h1>
            <p>Let's talk primaries. Primary colors are colors which can be used to create all other colors. The most common example of primary colors are Red, Yellow and Blue. However, these aren't the only primary colors.</p>
            <p>When dealing with light or displays, all other colors are created from the primary colors Red, Green and Blue. For printing, the primary colors are Cyan, Magenta and Yellow. The inheriently familiar Red, Yellow and Blue primaries, are used when mixing paints or dyes.</p>
            <p>The multiple sets of primary colors are based on additive and subtractive color systems. Additive colors create more light when mixed together, such as when two colored lights intersect each other. Subtractive colors absorb certain wavelengths and reflect others. If you've ever mixed paint or played with colored lights, you've seen these concepts in action.</p>
          </section>
        </>
      }
      </div>
    </div>
  )
}

export default Dialog;