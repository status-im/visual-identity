import React, { PureComponent, Fragment } from 'react';
import { CirclePicker } from 'react-color';
import CanvasDraw from "react-canvas-draw";
import { AppBar, Toolbar, IconButton } from '@material-ui/core';
import ZoomOutIcon from '@material-ui/icons/ZoomOut';


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
      canvasHeight: canvasHeight * 1.25
    })
    console.log({canvasState})
}

render() {
    const { canvasWidth, canvasHeight, brushSize, brushColor } = this.state;
    return (
      <Fragment>
        <AppBar>
          <Toolbar>
            <IconButton
              ref='zoom1'
              onClick={this.zoomOut}>
              <ZoomOutIcon/>
            </IconButton>
          </Toolbar>
        </AppBar>
        <CanvasDraw
          style={{ marginTop: '20%' }}
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
