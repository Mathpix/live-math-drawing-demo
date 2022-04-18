import React, { useEffect } from "react";
import { useCanvas } from "./CanvasContext";
import { ClearCanvasButton, LatexRenderer, UndoButton, RedoButton, CopyToClipboardButton} from './Utils'

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
    />
  );
}

export function Canvas() {

  

  return (
    <>
      <ClearCanvasButton/>
      <LatexRenderer/>
      <UndoButton />
      <RedoButton />
      <CopyToClipboardButton />
      <CanvasInternal/>
    </>
  );
}