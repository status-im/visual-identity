const { addPixels, getPixels } = require('./utils/canvasHelpers.js');

function setCanvasState(state, tx, canvas) {
  canvas.forEach(line => {
    const pixels = getPixels(line);
    pixels.forEach(pixel => {
      const [ x, y ] = pixel;
      state.pixels[pixel] = line;
    })
    state.canvasLines.push(line)
  })
}

function canvasLinesHandler(state, tx){
  if(tx.canvasLines) {
    setCanvasState(state, tx, tx.canvasLines)
  }
}

module.exports = {
  canvasLinesHandler
}
