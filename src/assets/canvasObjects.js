// Selected color circles.
const selectedColors = (ctx, currentColor, prevColor) => {
    ctx.beginPath();
    ctx.fillStyle = currentColor.length < 1 ? 'white' : currentColor.toString();
    ctx.arc(150, 43, 10, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.fillStyle = prevColor.length < 1 ? 'white' : prevColor.toString();
    ctx.arc(150, 73, 10, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
};

// Previous & current color text.
const colorInfo = (ctx) => {
    ctx.font = "18px Arial";
    ctx.fillStyle = "black";
    ctx.fillText('Current color:', 10, 50);
    ctx.fillText('Previous color:', 10, 80);
};

// ? icon.
const infoIcon = (ctx) => {
    ctx.beginPath();
    ctx.arc(document.body.clientWidth - 21, 21, 10, 0, 2 * Math.PI);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.stroke();
    ctx.font = "14px Arial";
    ctx.fillStyle = "black";
    ctx.fillText('?', document.body.clientWidth - 25, 26);
};

// Finds max radius that fits inside the canvas & sets each color segments radius.
const colorWheel = (canvas, ctx, canvasCenterX, canvasCenterY, colorList) => {
    const widthSmaller = canvas.width < canvas.height ? true : false; 
    const maxRadius = widthSmaller ? (window.screen.availWidth / 2) : (window.screen.availHeight / 2);
    const radius = maxRadius >= 400 ? 360 : maxRadius - 40; // Add breathing room.
    makeWheelSegments(ctx, radius, canvasCenterX, canvasCenterY, colorList);
  };
  
  // Creates each wheel segment.
  function makeWheelSegments(ctx, radius, canvasCenterX, canvasCenterY, colorList) {
  const data = [30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30]; // Length should equal colorList.length.
  let total = 0;
  let lastend = 0; // Ending angle for the last drawn segment.
  
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
export {selectedColors, colorInfo, colorWheel, infoIcon};