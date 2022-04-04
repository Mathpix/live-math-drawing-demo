import React from 'react'
import { Canvas } from './canvas/Canvas'
import { ClearCanvasButton, GetLatexButton, UndoButton, RedoButton} from './canvas/CanvasButtons'

function App() {
  return (
    <>
      <ClearCanvasButton/>
      <GetLatexButton />
      <UndoButton />
      <RedoButton />
      <Canvas/>
    </>
  );
}

export default App;