import { useCanvas } from './CanvasContext'

export const ClearCanvasButton = () => {
  const { clearCanvas } = useCanvas()

  return <button onClick={clearCanvas}>Clear</button>
}