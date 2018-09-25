import React, { PureComponent, Fragment } from 'react';
import { CirclePicker } from 'react-color';
import CanvasDraw from './CanvasDraw';
import { AppBar, Toolbar, IconButton, Button } from '@material-ui/core';
import { flatten } from 'lodash';
import ZoomOutIcon from '@material-ui/icons/ZoomOut';

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

const pixelToLine = pixel => ({
  color: '#FF0000',
  startX: pixel[0],
  endX: pixel[0],
  startY: pixel[1],
  endY: pixel[1],
  size: 1
});

class DrawingCanvas extends PureComponent {
  state = {
    loadTimeOffset: 5,
    brushSize: 1,
    brushColor: "#444",
    canvasWidth: 350,
    canvasHeight: 350,
    disabled: false
  }

  zoomOut = () => {
    const { canvasWidth, canvasHeight } = this.state;
    const canvasState = this.saveableCanvas.getSaveData();
    this.setState({
      canvasWidth: canvasWidth * 1.25,
      canvasHeight: canvasHeight * 1.25,
      canvasState
    })
    console.log({canvasState}, addPixels(canvasState.linesArray));
    this.loadState(canvasState);
  }

  loadState = data => {
    const { canvasState } = this.state;
    this.saveableCanvas.loadSaveData(data || canvasState, false);
  }

  calculateCost = () => {
    //assume 1 SNT per pixel for now
    const canvasState = this.saveableCanvas.getSaveData();
    console.log('pixel cost:', getCost(addPixels(canvasState.linesArray), 1))
  }

  drawPixels = () => {
    // drawing pixels alone will not work since curved lines don't use the full pixel.
    // when a user buys a pixel, a refernce should be stored to the lines in that pixel
    // main structure can look like this [ [ [{pixel}, lineIndex] ] ]
    // x y coordinates in line will be converted to wei and then back from wei for plotting
    // pixels to lines is many to many relationship
    const count = {};
    const canvasState = this.saveableCanvas.getSaveData();
    const pixels = flatten(canvasState.linesArray.map(getPixels));
    const filteredPixels = pixels.map(pixel => {
      if (!count[pixel]) {
        count[pixel] = 1;
        return pixel;
      } else {
        count[pixel]++
        return false
      }
    }).filter(pixel => pixel != false);
    const lines = filteredPixels.map(pixelToLine);
    console.log({canvasState, pixels, lines, count, filteredPixels})
    lines.forEach(line => this.saveableCanvas.drawLine(line));
  }

  render() {
    const { canvasWidth, canvasHeight, brushSize, brushColor } = this.state;
    window.sCanvas = this.saveableCanvas;
    return (
      <Fragment>
        <AppBar position="static" color="default">
          <Toolbar>
            <IconButton
              ref='zoom1'
              onClick={this.zoomOut}>
              <ZoomOutIcon/>
            </IconButton>
            <Button variant="outlined" color="primary" onClick={this.calculateCost}>Submit</Button>
            <Button variant="outlined" color="primary" onClick={this.drawPixels}>Draw Pixels</Button>
          </Toolbar>
        </AppBar>
        <CanvasDraw
          style={{ borderStyle: 'groove' }}
          ref={canvasDraw => (this.saveableCanvas = canvasDraw)}
          canvasWidth={canvasWidth}
          canvasHeight={canvasHeight}
          brushSize={brushSize}
          brushColor={brushColor}
        />
        <CirclePicker
          id='brushColor' color={brushColor}
          onChange={(color) => this.setState({brushColor: color.hex})}/>
      </Fragment>
    )
  }
}

export default DrawingCanvas;
