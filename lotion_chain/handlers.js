const { addPixels, getPixels, getCost } = require('./utils/canvasHelpers.js');
const { verifySignedTx, verifySignedMessage } = require('./utils/signing.js');
const { subtractAmounts, addAmounts } = require('./utils/balances.js');
const { isNil } = require('lodash');
const web3 = require('web3');

function setCanvasState(state, tx) {
  const { publicKey } = tx;
  const { pixelValue, linesArray } = tx.data;
  linesArray.forEach(line => {
    const pixels = getPixels(line);
    pixels.forEach(pixel => {
      if (isNil(state.pixels[pixel])) {
        state.pixels[pixel] = { ...line, pixelValue, owner: publicKey };
        state.balance[publicKey] = subtractAmounts(state.balance[publicKey], pixelValue);
        state.taxEscrow[publicKey] = addAmounts(pixelValue)
      } else {
        const existing = { ...state.pixels[pixel] };
        state.balance[publicKey] = subtractAmounts(state.balance[publicKey], existing.pixelValue);
        state.balance[existing.owner] = addAmounts(state.balance[publicKey], existing.PixelValue);
        state.balance[publicKey] = subtractAmounts(state.balance[publicKey], pixelValue);
        state.taxEscrow[publicKey] = addAmounts(pixelValue);
      }
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
  const { publicKey } = tx;
  const stateAccount = state.accounts[publicKey];
  const verified = verifySignedTx(tx);
  if (!verified || isNil(stateAccount)) return;
  if (tx.data.linesArray) {
    if (!canPurchase(state, tx)) return;
    setCanvasState(state, tx);
  }
}

function createAccountHandler(state, tx) {
  const { proofOfOwnership } = tx;
  const { msg } = proofOfOwnership;
  if (proofOfOwnership && verifySignedMessage(proofOfOwnership)) {
    state.accounts[msg] = { proofOfOwnership };

    //TODO remove this after testing phase
    state.balances[msg] = web3.utils.toWei('1', 'ether');
  }
}

function rootHandler(state, tx) {
  switch(tx.type) {
  case 'PURCHASE':
    canvasLinesHandler(state, tx)
    break;
  case 'CREATE_ACCOUNT':
    createAccountHandler(state, tx)
    break;
  default:
    break;
  }
}

module.exports = {
  rootHandler
}
