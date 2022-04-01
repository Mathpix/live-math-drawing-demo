import React from 'react'
import { Canvas } from './canvas/Canvas'
import { ClearCanvasButton } from './canvas/ClearCanvasButton'

function App() {
  return (
    <>
      <ClearCanvasButton/>
      <Canvas/>
    </>
  );
}

export default App;