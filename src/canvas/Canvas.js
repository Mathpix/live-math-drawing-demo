import React, { useEffect } from "react";
import { useCanvas } from "./CanvasContext";
import { ClearCanvasButton, LatexRenderer, UndoButton, RedoButton, CopyToClipboardButton} from './Utils'
import './canvas.css'

function CanvasInternal() {
  const {
    canvasRef,
    prepareCanvas,
    startDrawing,
    finishDrawing,
    leaveCanvas,
    draw,
  } = useCanvas();

  useEffect(() => {
    prepareCanvas();
  }, []);

  return (
    <canvas
      onMouseDown={startDrawing}
      onMouseUp={finishDrawing}
      onMouseMove={draw}
      onMouseOut={leaveCanvas}
      ref={canvasRef}
      className="canvas"
    />
  );
}

export function Canvas() {

  

  return (
    <>
      <LatexRenderer/>
      <div className="canvas-buttons-container">
        <ClearCanvasButton/>
        <UndoButton />
        <RedoButton />
        <CopyToClipboardButton />
      </div>
      <CanvasInternal/>
    </>
  );
}