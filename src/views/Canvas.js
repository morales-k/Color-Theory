import React, {useState, useEffect, useRef} from 'react'

function Canvas() {
  const centerWidth = document.getElementById('gameboard').offsetWidth / 2;
  const centerHeight = document.getElementById('gameboard').offsetHeight / 2;
  const orientation = window.matchMedia("(orientation: portrait)");
  const [canvasCenterX, setCanvasCenterX] = useState(centerWidth);
  const [canvasCenterY, setCanvasCenterY] = useState(centerHeight);
  const [mouseX, setmouseX] = useState(centerWidth);
  const [mouseY, setmouseY] = useState(centerHeight);
  const [isPortrait, setPortrait] = useState(orientation.matches);
  const canvas = useRef();
  const dpr = window.devicePixelRatio || 1;

  // Set up resize listener for responsive canvas.
  useEffect(() => {
    setupCanvas();

    window.addEventListener('resize', () => {
      setupCanvas();
      setPortrait(orientation.matches);
    });

    // Clean up
    return () => {
      window.removeEventListener('resize', () => {
        setupCanvas();
        setPortrait(orientation.matches);
      });
    };
  }, []);

  // Redraw when mouse coordinates or orientation updates.
  useEffect(() => {
    draw();
  }, [mouseX, mouseY, isPortrait]);

  /* CANVAS OBJECTS */

  // Color Wheel - Responsive
  const colorWheel = (ctx) => {
    // Find max radius that fits inside the canvas by dividing the smaller side by 2.
    const widthSmaller = canvas.width < canvas.height ? true : false; 
    const maxRadius = widthSmaller ? (window.screen.availWidth / 2) : (window.screen.availHeight / 2);
    // Set a max radius and give it some breathing room.
    const radius = maxRadius >= 400 ? 380 : maxRadius - 20;

    makeWheelSegments(ctx, radius);
  };
  
  // Create each wheel segment.
  function makeWheelSegments(ctx, radius) {
  const data = [30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30]; // If more values are added, add more colors.
  let colorList = ['#ff0000', '#ff6800', '#ffa500', '#ffd200', '#ffff00', '#80bf00', '#008000', '#0d98ba', '#0000ff', '#800080', '#a00060', '#bf0040']; // Colors of each slice. Starts at 3 O'clock & goes clockwise.

  let total = 0; // Automatically calculated so don't touch
  let lastend = 0;
  
  for (let e = 0; e < data.length; e++) {
    total += data[e];
  }
  
  for (let i = 0; i < data.length; i++) {
    ctx.fillStyle = colorList[i];
    ctx.beginPath();
    ctx.moveTo(canvasCenterX, canvasCenterY);
    // Arc Parameters: x, y, radius, startingAngle (radians), endingAngle (radians), antiClockwise (boolean)
    ctx.arc(canvasCenterX, canvasCenterY, radius, lastend, lastend + (Math.PI * 2 * (data[i] / total)), false);
    ctx.lineTo(canvasCenterX, canvasCenterY);
    ctx.fill();
    lastend += Math.PI * 2 * (data[i] / total);
  }
}
  /*****/

  // Sets canvas and scales based on device pixel ratio.
  function setupCanvas() {
    const rect = canvas.current.getBoundingClientRect();
    const ctx = canvas.current.getContext('2d');
    const resizedWidth = rect.width * dpr;
    const resizedHeight = window.innerHeight * dpr;

    // Scale the current canvas by device pixel ratio to fix blur.
    canvas.current.width = resizedWidth;
    canvas.current.height = resizedHeight;

    // Set height of the canvas itself to fit screen.
    canvas.height = resizedHeight;
    ctx.scale(dpr, dpr);

    // Update canvas center when resized.
    setCanvasCenterX(rect.width / 2);
    setCanvasCenterY(rect.height / 2);
    return ctx;
  }

  // Clears & redraws the canvas.
  function draw() {
    const ctx = canvas.current.getContext('2d');
    const rect = canvas.current.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    colorWheel(ctx);
  }

  // Updates mouse coordinates.
  function trackmouse(e) {
    setmouseX(e.clientX);
    setmouseY(e.clientY);
  }

  // Gets the current color on click/touch. Mobile values should be multiplied by dpr for correct color selection.
  function getCurrentColor(e, isTouch = false) {
    const xPos = isTouch ? e.changedTouches[0].clientX * dpr : e.clientX;
    const yPos = isTouch ? e.changedTouches[0].clientY * dpr : e.clientY;
    const ctx = canvas.current.getContext('2d');
    let imgData = ctx.getImageData(xPos, yPos, 1, 1);
    let red = imgData.data[0];
    let green = imgData.data[1];
    let blue = imgData.data[2];
    let alpha = imgData.data[3];
    console.log(red + " " + green + " " + blue + " " + alpha);
  }

  return (
    <canvas id="canvas" ref={canvas} onTouchEnd={(e) => getCurrentColor(e, true)} onClick={(e) => getCurrentColor(e, false)} />
  )
}

export default Canvas