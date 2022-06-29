import React, {useState, useEffect, useRef} from 'react'
import {selectedColors, colorInfo, colorWheel} from '../assets/canvasObjects';
import allColors from '../assets/colors.json';

function Canvas() {
  const centerWidth = document.getElementById('gameboard').offsetWidth / 2;
  const centerHeight = document.getElementById('gameboard').offsetHeight / 2;
  const orientation = window.matchMedia("(orientation: portrait)");
  const [canvasCenterX, setCanvasCenterX] = useState(centerWidth);
  const [canvasCenterY, setCanvasCenterY] = useState(centerHeight);
  const [isPortrait, setPortrait] = useState(orientation.matches);
  const [prevColor, setPrevColor] = useState(''); // Hex string.
  const [currentColor, setCurrentColor] = useState(''); // Hex string.
  const [colorList, setColorList] = useState(['#ff0000', '#898989', '#adadad', '#c8c8c8', '#ffff00', '#979797', '#4b4b4b', '#727272', '#0000ff', '#343434', '#3a3a3a', '#404040']); // Colors of each slice. Starts at 3 O'clock & goes clockwise.
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

  // Redraw when orientation or currentColor changes.
  useEffect(() => {
    if (currentColor.length === 7) {
      checkColorMix();
    }
    draw();
  }, [currentColor, isPortrait]);

  useEffect(() => {
    draw();
  }, [colorList]);

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
    colorWheel(canvas, ctx, canvasCenterX, canvasCenterY, colorList);
    colorInfo(ctx);
    selectedColors(ctx, currentColor, prevColor);
  }

  // Gets the current color on click/touch. Values should be multiplied by dpr for correct color selection.
  function getCurrentColor(e, isTouch = false) {
    e.preventDefault(); // Prevents multiple touch/click events.
    const xPos = isTouch ? e.changedTouches[0].clientX * dpr : e.clientX * dpr;
    const yPos = isTouch ? e.changedTouches[0].clientY * dpr : e.clientY * dpr;
    const ctx = canvas.current.getContext('2d');
    let imgData = ctx.getImageData(xPos, yPos, 1, 1);
    let red = imgData.data[0];
    let green = imgData.data[1];
    let blue = imgData.data[2];
    let hexColor = ConvertRGBtoHex(red, green, blue);

    // Set prevColor before updating currentColor.
      setPrevColor(currentColor);
      setCurrentColor(hexColor);
  }

  // Takes a number value & converts it to a 2 digit hex string.
  function ColorToHex(color) {
    var hexadecimal = color.toString(16);
    return hexadecimal.length === 1 ? "0" + hexadecimal : hexadecimal;
  }
  
  // Returns 6 digit hex string based on number values of rgb.
  function ConvertRGBtoHex(red, green, blue) {
    return "#" + ColorToHex(red) + ColorToHex(green) + ColorToHex(blue);
  }

  // Checks if 2 colors make a new color.
  function checkColorMix() {
    allColors.colors.map(color => {
      if (color.mix.includes(prevColor) && color.mix.includes(currentColor)) {
        // Display the mixed color.
        findColorEquivalent(color.greyscale, color.hex);
      }
    });
  }

  
  // Finds the greyscale color in colorList & replaces it with hex.
  function findColorEquivalent(greyscale, hex) {
    let updatedList = [...colorList];
    let updateIndex = updatedList.indexOf(greyscale);
    updatedList[updateIndex] = hex;
    setColorList(updatedList);
  }

  return (
    <canvas id="canvas" ref={canvas} onTouchEnd={(e) => getCurrentColor(e, true)} onClick={(e) => getCurrentColor(e, false)} />
  )
}

export default Canvas