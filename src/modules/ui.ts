
export class UI {


}

export function redrawCanvas(canvas: HTMLCanvasElement, img: HTMLImageElement) {
  const ctx = canvas.getContext('2d')!
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
}

export function highlight(canvas, startWidth, startHeight, endWidth, endHeight) {
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = 'rgb(255 0 0 / 50%)'
  ctx.fillRect(startWidth, startHeight, endWidth, endHeight)
}

export function getTileFromMouse(
  event: MouseEvent,
  mapCanvas: HTMLCanvasElement,
  tileSize: number,
  gridWidth: number,
  gridHeight: number
): { row: number, col: number } {
  const rect = mapCanvas.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top

  const col = Math.floor(x / tileSize)
  const row = Math.floor(y / tileSize)

  return {
    row: Math.max(0, Math.min(row, gridHeight - 1)),
    col: Math.max(0, Math.min(col, gridWidth - 1))
  }
}

export function toggleGrid(canvas: HTMLCanvasElement, tileSize: number) {
  const ctx = canvas.getContext('2d')!

  const width = canvas.width
  const height = canvas.height

  ctx.beginPath()

  for (let x = 0; x <= width; x += tileSize) {
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

  for (let y = 0; y <= height; y += tileSize) {
    ctx.moveTo(0, y)
    ctx.lineTo(width, y)
  }

  // set the color of the line
  ctx.strokeStyle = 'Gainsboro'
  // just for fun
  ctx.lineWidth = 1
  ctx.stroke()
}

export function showAttributes(divId: string, attributes: Object) {
  const div = document.getElementById(divId)

  // Remove any previous attribute text
  if (div?.hasChildNodes) {
    while (div.firstChild) {
      div.removeChild(div.firstChild)
    }
  }

  const header = document.createElement('h4')
  const p = document.createElement('p')

  header.textContent = 'Tile Attributes'
  p.textContent = JSON.stringify(attributes, undefined, 2)

  div?.appendChild(header)
  div?.appendChild(p)
}
