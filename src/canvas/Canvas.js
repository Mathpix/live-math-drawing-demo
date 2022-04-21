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
    <div className="canvas-container">
      <canvas
        ref={canvasRef}
        className="canvas"
      />
    </div>
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