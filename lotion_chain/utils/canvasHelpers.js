const { flatten } = require('lodash');

function* range(start, end) {
  const { min, max } = Math;
  for (let i = min(start, end); i <= max(start, end); i++) {
    yield i;
  }
}

function getPixels (lineCoordinates) {
  const { startX, startY, endX, endY } = lineCoordinates;
  const { floor } = Math;
  const xRange = [ ...range(floor(startX), floor(endX)) ];
  const yRange = [ ...range(floor(startY), floor(endY)) ];
  return flatten(xRange.map(xCoordinate => yRange.map(yCoordinate => [xCoordinate, yCoordinate])));
}

const addPixels = linesArray => linesArray.map(line => ({ ...line, pixels: getPixels(line)}));

const getCost = (plottedArray, amount) => {
  return plottedArray.reduce((pv, line) => {
    const { pixels } = line;
    const lineValue = pixels.reduce((pv, cv) => {
      //TODO will have to check price of pixel and see if amount is greater.
      const [x , y] = cv;
      return pv + amount;
    }, 0);
    return pv + lineValue;
  }, 0)
}

module.exports = {
  addPixels,
  getPixels
}
