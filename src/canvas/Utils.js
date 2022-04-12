import { useCanvas } from './CanvasContext'
import { useState } from 'react'

export const ClearCanvasButton = () => {
  const { clearCanvas } = useCanvas()
  const handleClick = () => {
    clearCanvas(false);
  }
  return <button onClick={handleClick}>Clear</button>
}

export const GetLatexButton = () => {
  const [latexCode, setLatexCode] = useState('LaTeX code');
  const { getLatex } = useCanvas();
  const handleClick = async() => {
    const response = await getLatex();
    setLatexCode(response.data.latex_styled);
  }

  return (
    <div>
    <button onClick={handleClick}> Get LaTeX</button>
    <code>{latexCode}</code>
    </div>
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