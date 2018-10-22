const { addPixels, getPixels, getCost } = require('./utils/canvasHelpers.js');
const { verifySignedTx, verifySignedMessage } = require('./utils/signing.js');

function setCanvasState(state, tx) {
  const { pixelValue, linesArray } = tx.data;
  linesArray.forEach(line => {
    const pixels = getPixels(line);
    pixels.forEach(pixel => {
      state.pixels[pixel] = { ...line, pixelValue };
    })
    state.canvasLines.push(line);
  })
}

function canPurchase(state, tx) {
  const { linesArray, pixelValue } = tx.data;
  const requiredCost = getCost(linesArray, pixelValue, state.pixels);
  const proposedCost = getCost(linesArray, pixelValue);
  return proposedCost >= requiredCost;
}

function canvasLinesHandler(state, tx){
  const verified = verifySignedTx(tx);
  if (!verified) return;
  if (tx.data.linesArray) {
    if (!canPurchase(state, tx)) return;
    setCanvasState(state, tx);
  }
}

function createAccountHandler(state, tx) {
  const { proofOfOwnership } = tx;
  const { msg } = proofOfOwnership;
  if (proofOfOwnership && verifySignedMessage(proofOfOwnership)) {
    console.log(proofOfOwnership)
    state.accounts[msg] = { proofOfOwnership };
  }
}

function rootHandler(state, tx) {
  switch(tx.type) {
  case 'PURCHASE':
    canvasLinesHandler(state, tx)
    break;
  case 'CREATE_ACCOUNT':
    //
    break;
  default:
    break;
  }
}

module.exports = {
  rootHandler
}
