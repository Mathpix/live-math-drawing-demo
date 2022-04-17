import React from 'react'
import { Canvas } from './canvas/Canvas'
import { ClearCanvasButton, LatexRenderer, UndoButton, RedoButton} from './canvas/Utils'

function App() {
  return (
    <>
      <ClearCanvasButton/>
      <LatexRenderer/>
      <UndoButton />
      <RedoButton />
      <Canvas/>
    </>
  );
}

export default App;