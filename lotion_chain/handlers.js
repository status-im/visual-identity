const { addPixels, getPixels, getCost } = require('./utils/canvasHelpers.js');

function setCanvasState(state, tx) {
  const { pixelValue, linesArray } = tx;
  linesArray.forEach(line => {
    const pixels = getPixels(line);
    pixels.forEach(pixel => {
      state.pixels[pixel] = { ...line, pixelValue };
    })
    state.canvasLines.push(line);
  })
}

function canPurchase(state, tx) {
  const requiredCost = getCost(tx.linesArray, tx.pixelValue, state.pixels);
  const proposedCost = getCost(tx.linesArray, tx.pixelValue);
  return proposedCost >= requiredCost;
}

function canvasLinesHandler(state, tx){
  //TODO add checks for account
  if(tx.linesArray) {
    if (!canPurchase(state, tx)) return;
    setCanvasState(state, tx, tx.linesArray);
  }
}

function rootHandler(state, tx) {
  switch(tx.type) {
  case 'PURCHASE':
    canvasLinesHandler(state, tx)
    break;
  case 'NEW_ACCOUNT':
    //
    break;
  default:
    break;
  }
}

module.exports = {
  rootHandler
}
