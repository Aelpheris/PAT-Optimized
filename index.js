const canvas = document.getElementById('map');
const ctx = canvas.getContext('2d');

const image = new Image();
image.onload = draw;

image.src = 'map.png';

function draw() {
  canvas.width = this.naturalWidth;
  canvas.height = this.naturalHeight;

  console.log('width: ', canvas.width);
  console.log('height: ', canvas.height);

  ctx.drawImage(this, 0, 0);

  drawGrid();
}

function drawGrid() {
  const width = canvas.width;
  const height = canvas.height;
  const step = 14;

  ctx.beginPath();

  for (let x = 0; x <= width; x += step) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
  }

  // set the color of the line
  ctx.strokeStyle = 'Gainsboro';
  ctx.lineWidth = 1;
  // the stroke will actually paint the current path 
  ctx.stroke();
  // for the sake of the example 2nd path
  ctx.beginPath();

  for (let y = 0; y <= height; y += step) {
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
  }

  // set the color of the line
  ctx.strokeStyle = 'Gainsboro';
  // just for fun
  ctx.lineWidth = 1;
  // for your original question - you need to stroke only once
  ctx.stroke();
}

function clipCell(image, x, y, width, height) {
  
  var canvas = document.createElement('canvas'),
  ctx = canvas.getContext('2d');

  canvas.width = width;
  canvas.height = height;

  //                   source region         dest. region
  ctx.drawImage(image, x, y, width, height,  0, 0, width, height);

  return canvas;
}
