import React, {useState, useEffect, useRef} from 'react'
import {selectedColors, colorInfo, colorWheel, infoIcon} from '../assets/canvasObjects';
import allColors from '../assets/colors.json';
import win from '../assets/sounds/win.mp3';
import drop from '../assets/sounds/drop.mp3';
import Dialog from './Dialog';

function Canvas() {
  const originalColors = ['#ff0000', '#898989', '#adadad', '#c8c8c8', '#ffff00', '#979797', '#4b4b4b', '#727272', '#0000ff', '#343434', '#3a3a3a', '#404040'];
  const centerWidth = document.getElementById('gameboard').offsetWidth / 2;
  const centerHeight = document.getElementById('gameboard').offsetHeight / 2;
  const orientation = window.matchMedia("(orientation: portrait)");
  const [canvasCenterX, setCanvasCenterX] = useState(centerWidth);
  const [canvasCenterY, setCanvasCenterY] = useState(centerHeight);
  const [isPortrait, setPortrait] = useState(orientation.matches);
  const [prevColor, setPrevColor] = useState(''); // Hex string.
  const [currentColor, setCurrentColor] = useState(''); // Hex string.
  const [colorList, setColorList] = useState(originalColors); // Colors of each slice. Starts at 3 O'clock & goes clockwise.
  const [showDialog, toggleDialog] = useState(false);
  const [foundColors, setFoundColors] = useState(3); // Start with 3 of 12 since primaries visible.
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
    setupCanvas();
    draw();
  }, [colorList, canvasCenterX, canvasCenterY]);

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
    infoIcon(ctx);
  }

  // Gets the current color on click/touch. Values should be multiplied by dpr for correct color selection.
  function getCurrentColor(e, isTouch = false) {
    e.preventDefault(); // Prevents multiple touch/click events.
    const xPos = isTouch ? e.changedTouches[0].clientX * dpr : e.clientX * dpr;
    const yPos = isTouch ? e.changedTouches[0].clientY * dpr : e.clientY * dpr;
    const ctx = canvas.current.getContext('2d');
    let imgData = ctx.getImageData(xPos, yPos, 1, 1);
    let hexColor = ConvertRGBtoHex(imgData.data[0], imgData.data[1], imgData.data[2]); // RGB values.

    // Check if infoIcon was clicked.
    let info = new Path2D();
    info.arc(document.body.clientWidth - 21, 21, 10, 0, 2 * Math.PI);
    if (ctx.isPointInPath(info, xPos, yPos)) {
      toggleDialog(!showDialog);
    }

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
      if (!colorList.includes(color.hex) && color.mix.includes(prevColor) && color.mix.includes(currentColor)) {
        const dropSound = new Audio(drop);
        let numberFound = foundColors + 1;

        dropSound.play();
        setFoundColors(numberFound);

        if (numberFound === 12) {
          const winSound = new Audio(win);
          winSound.play();
        }

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

  function resetGame() {
    setFoundColors(3);
    setPrevColor('');
    setCurrentColor('');
    setColorList(originalColors);
  }

  return (
    <>
    {
      showDialog && <Dialog showDialog={showDialog} toggleDialog={toggleDialog} win={false} />
    }
    {
      foundColors === 12 && <Dialog showDialog={showDialog} toggleDialog={toggleDialog} win={true} resetGame={resetGame} />
    }
    <canvas id="canvas" ref={canvas} onTouchEnd={(e) => getCurrentColor(e, true)} onClick={(e) => getCurrentColor(e, false)} />
    </>
  )
}

export default Canvas