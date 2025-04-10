const image = new Image();
image.crossOrigin = "Anonymous";
image.src = './test-map-1.png';

const canvas = document.getElementById('map');
const ctx = canvas.getContext('2d');
const tileCanvas = document.getElementById('selected-tile');
const tileCtx = tileCanvas.getContext('2d');
tileCtx.imageSmoothingEnabled = true;

let tiles = [];

image.onload = draw;


function draw() {
  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;

  console.log('width: ', canvas.width);
  console.log('height: ', canvas.height);

  ctx.drawImage(image, 0, 0);

  gridTotiles(canvas, ctx);
}

function toggleGrid() {
  let checkbox = document.getElementById("grid");

  if (checkbox.checked) {
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

  else {
    ctx.drawImage(image, 0, 0);
  }
}

function cliptile(image, x, y, width, height) {
  
  let canvas = document.createElement('canvas');
  ctx = canvas.getContext('2d');

  canvas.width = width;
  canvas.height = height;

  //                   source region         dest. region
  ctx.drawImage(image, x, y, width, height,  0, 0, width, height);

  return canvas;
}

function selecttile(e, dest, canvas, ctx) {
  const bounding = canvas.getBoundingClientRect();
  const x = e.clientX - bounding.left;
  const y = e.clientY - bounding.top;
  const pixel = ctx.getImageData(x, y, 1, 1);
  const data = pixel.data;

  const rgbColor = `rgb(${data[0]} ${data[1]} ${data[2]} / ${data[3] / 255})`;
  dest.style.background = rgbColor;
  dest.textContent = rgbColor;

  tileCtx.drawImage(canvas, x, y, 14, 14, 0, 0, 56, 56);

  console.log('pixel width: ', x);
  console.log('pixel height: ', y);
  console.log('pixel color: ', rgbColor);

  return rgbColor;
}

// Splits the entire grid into a collection of tiles to be searchable and usable for
// selecting individual tiles
function gridTotiles(canvas, ctx) {
  let tile = document.createElement('canvas');
  ctx = tile.getContext('2d');

  tile.width = 14;
  tile.height = 14;


  for (let y = 0; y <= canvas.height; y += tile.height) {
    for (let x = 0; x <= canvas.width; x += tile.width) {
      const tile = {
        'sx': x,
        'sy': y,
        // 'data': ctx.getImageData(x, y, 14, 14)
      }
      tiles.push(tile);
    }
  }

  console.log('number of tiles: ', tiles.length);
  console.log('first tile: ', tiles[0]);
  return tiles;
}

function showtile(id) {

  console.log('showtile');

  console.log('tile: ', tiles[id]);

  // tileCtx.putImageData(tiles[0].data, 0, 0);

  tileCtx.drawImage(canvas, tiles[id].x, tiles[id].y, 14, 14, 0, 0, 56, 56);
}

canvas.addEventListener('click', (event) => {
  console.log('clicked');
  selecttile(event, tileCanvas, canvas, ctx);
});


