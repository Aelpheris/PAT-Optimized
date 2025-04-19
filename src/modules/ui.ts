export function redrawCanvas(canvas, img) {
  const ctx = canvas.getContext('2d')
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
}

export function highlight(canvas, startWidth, startHeight, endWidth, endHeight) {
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = 'rgb(255 0 0 / 50%)'
  ctx.fillRect(startWidth, startHeight, endWidth, endHeight)
}

export function toggleGrid(canvas, img, tileWidth, tileHeight) {
  const ctx = canvas.getContext('2d')
  const checkbox = document.getElementById("grid")

  if (checkbox.checked) {
    const width = canvas.width
    const height = canvas.height

    ctx.beginPath()

    for (let x = 0; x <= width; x += tileWidth) {
      ctx.moveTo(x, 0)
      ctx.lineTo(x, height)
    }

    // set the color of the line
    ctx.strokeStyle = 'Gainsboro'
    ctx.lineWidth = 1
    // the stroke will actually paint the current path 
    ctx.stroke()
    // for the sake of the example 2nd path
    ctx.beginPath()

    for (let y = 0; y <= height; y += tileHeight) {
      ctx.moveTo(0, y)
      ctx.lineTo(width, y)
    }

    // set the color of the line
    ctx.strokeStyle = 'Gainsboro'
    // just for fun
    ctx.lineWidth = 1
    // for your original question - you need to stroke only once
    ctx.stroke()
  }

  else {
    redrawCanvas(canvas, img)
  }
}