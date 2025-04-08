const image = new Image();
image.crossOrigin = "Anonymous";
image.src = './map.png';

const canvas = document.getElementById('map');
const ctx = canvas.getContext('2d');
const cellCanvas = document.getElementById('selected-cell');
const cellCtx = cellCanvas.getContext('2d');

let cells = [];

image.onload = draw;


function draw() {
  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;

  console.log('width: ', canvas.width);
  console.log('height: ', canvas.height);

  ctx.drawImage(image, 0, 0);
  cellCtx.fillRect(0, 0, 56, 56);

  gridToCells(canvas, ctx);

  // drawGrid();
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
  
  let canvas = document.createElement('canvas');
  ctx = canvas.getContext('2d');

  canvas.width = width;
  canvas.height = height;

  //                   source region         dest. region
  ctx.drawImage(image, x, y, width, height,  0, 0, width, height);

  return canvas;
}

function selectCell(e, dest, canvas, ctx) {
  const bounding = canvas.getBoundingClientRect();
  const x = e.clientX - bounding.left;
  const y = e.clientY - bounding.top;
  const pixel = ctx.getImageData(x, y, 1, 1);
  const data = pixel.data;

  const rgbColor = `rgb(${data[0]} ${data[1]} ${data[2]} / ${data[3] / 255})`;
  dest.style.background = rgbColor;
  dest.textContent = rgbColor;

  console.log('pixel width: ', x);
  console.log('pixel height: ', y);
  console.log('pixel color: ', rgbColor);

  return rgbColor;
}

function firstCell(e, dest, canvas, ctx) {
  const bounding = canvas.getBoundingClientRect();
  const x = e.clientX - bounding.left;
  const y = e.clientY - bounding.top;
  const pixel = ctx.getImageData(x, y, 14, 14);
  const data = pixel.data;

  console.log('pixel width: ', x);
  console.log('pixel height: ', y);
}

// Splits the entire grid into a collection of cells to be searchable and usable for
// selecting individual cells
function gridToCells(canvas, ctx) {
  let cell = document.createElement('canvas');
  ctx = cell.getContext('2d');

  cell.width = 14;
  cell.height = 14;


  for (let y = 0; y <= canvas.height; y += cell.height) {
    for (let x = 0; x <= canvas.width; x += cell.width) {
      const cell = {
        'sx': x,
        'sy': y,
        // 'data': ctx.getImageData(x, y, 14, 14)
      }
      cells.push(cell);
    }
  }

  console.log('number of cells: ', cells.length);
  console.log('first cell: ', cells[0]);
  return cells;
}

function showCell(id) {

  console.log('showCell');

  console.log('cell: ', cells[id]);

  // cellCtx.putImageData(cells[0].data, 0, 0);

  cellCtx.drawImage(canvas, cells[id].x, cells[id].y, 14, 14, 0, 0, 56, 56);
}

canvas.addEventListener('click', (event) => {
  console.log('clicked');
  selectCell(event, cellCanvas, canvas, ctx);
});
