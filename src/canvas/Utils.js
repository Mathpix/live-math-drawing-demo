import { useCanvas } from './CanvasContext'
import { MathpixLoader, MathpixMarkdown } from 'mathpix-markdown-it'

export const ClearCanvasButton = () => {
  const { clearCanvas } = useCanvas()
  const handleClick = () => {
    clearCanvas(false);
  }
  return <button onClick={handleClick}>Clear</button>
}

export const LatexRenderer = () => {
  const { latexCode } = useCanvas();
  return (
    <MathpixLoader>
      <MathpixMarkdown text={latexCode} />
    </MathpixLoader>
  )
}

export const UndoButton = () => {
  const { undoHistory, undo } = useCanvas();
  const handleClick = () => {
    undo();
  }

  return (
    <div>
    <button onClick={handleClick} disabled={undoHistory.length === 0}> Undo</button>
    </div>
  )
}

export const RedoButton = () => {
  const { redoHistory, redo } = useCanvas();
  const handleClick = () => {
    redo();
  }

  return (
    <div>
    <button onClick={handleClick} disabled={redoHistory.length === 0}> Redo</button>
    </div>
  )
}

export const CopyToClipboardButton = () => {
  const { latexCode } = useCanvas();
  const handleClick = () => {
    navigator.clipboard.writeText(latexCode);
  }
  return (
    <button onClick={handleClick}>Copy LaTeX</button>
  )
}