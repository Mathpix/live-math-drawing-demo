import React from 'react'
import { Canvas } from './canvas/Canvas'
import { ClearCanvasButton, LatexRenderer, UndoButton, RedoButton, CopyToClipboardButton} from './canvas/Utils'

function App() {
  return (
    <>
      <ClearCanvasButton/>
      <LatexRenderer/>
      <UndoButton />
      <RedoButton />
      <CopyToClipboardButton />
      <Canvas/>
    </>
  );
}

export default App;