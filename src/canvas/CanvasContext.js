import React, { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";

const CanvasContext = React.createContext();

export const CanvasProvider = ({ children }) => {
  const [isDrawing, setIsDrawing] = useState(false)
  const [strokes, setStrokes] = useState([]);
  const [currentStroke, setCurrentStroke] = useState([]);
  const [undoHistory, setUndoHistory] = useState([]);
  const [redoHistory, setRedoHistory] = useState([]);
  const [redrawFlag, setRedrawFlag] = useState(false);
  const [redoFlag, setRedoFlag] = useState(false);
  const [undoFlag, setUndoFlag] = useState(false);
  const canvasRef = useRef(null);
  const contextRef = useRef(null);

  const prepareCanvas = () => {
    const canvas = canvasRef.current
    canvas.width = window.innerWidth * 2;
    canvas.height = window.innerHeight * 2;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;

    const context = canvas.getContext("2d")
    context.scale(2, 2);
    context.lineCap = "round";
    context.strokeStyle = "black";
    context.lineWidth = 3;
    contextRef.current = context;
  };

  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    setCurrentStroke([{x: offsetX, y: offsetY}]);
    setIsDrawing(true);
  };

  const finishDrawing = () => {
    setStrokes([...strokes, currentStroke]);
    setUndoHistory([...undoHistory, {action: "Add", strokes:[currentStroke]}]);
    setRedoHistory([]);
    contextRef.current.closePath();
    setIsDrawing(false);
  };

  useEffect(() => {
    redraw();
  }, [redrawFlag]);

  useEffect(() => {
    console.log("Undo =>"+undoHistory.length);
    console.log("Redo =>"+redoHistory.length);
  }, [undoHistory, redoHistory]);

  useEffect(() => {
    const redoStrokes = undoHistory[undoHistory.length - 1];
    if (redoStrokes) {
      if (redoStrokes.action === "Add") {
        setStrokes([...strokes, ...redoStrokes.strokes]);
      }
      else if (redoStrokes.action === "Remove") {
        setStrokes(strokes.filter(stroke => !redoStrokes.strokes.includes(stroke)));
      }
      setRedrawFlag(!redrawFlag);
    }
  }, [redoFlag]);

  useEffect(() => {
    const undoStrokes = redoHistory[redoHistory.length - 1];
    if (undoStrokes) {
      if (undoStrokes.action === "Add") {
        setStrokes(strokes.filter(stroke => !undoStrokes.strokes.includes(stroke)));
      } else if (undoStrokes.action === "Remove") {
        setStrokes([...strokes, ...undoStrokes.strokes]);
      }
      setRedrawFlag(!redrawFlag);

    }
  }, [undoFlag]);

  const undo = () => {
    if (undoHistory.length === 0) {
      return;
    }
    const undoStrokes = undoHistory[undoHistory.length - 1];
    setUndoHistory(undoHistory.slice(0, -1));
    setRedoHistory([...redoHistory, undoStrokes]);
    setUndoFlag(!undoFlag);
  };


  const redo = () => {
    if (redoHistory.length === 0) {
      return;
    }
    const redoStrokes = redoHistory[redoHistory.length - 1];
    setUndoHistory([...undoHistory, redoStrokes]);
    setRedoHistory(redoHistory.slice(0, -1));
    setRedoFlag(!redoFlag);
  };

  const redraw = () => {
    console.log(strokes.length);
    clearCanvas();
    strokes.forEach(stroke => {
      stroke.forEach((point, index) => {
        if (index === 0) {
          contextRef.current.beginPath();
          contextRef.current.moveTo(point.x, point.y);
        } else {
          contextRef.current.lineTo(point.x, point.y);
        }
      });
      contextRef.current.stroke();
      contextRef.current.closePath();
    });
  };

  const draw = ({ nativeEvent }) => {
    if (!isDrawing) {
      return;
    }
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
    setCurrentStroke([...currentStroke, {x: offsetX, y: offsetY}]);
  };


  const leaveCanvas = () => {
    setIsDrawing(false);
  }

  const clearCanvas = (redraw=true) => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d")
    context.fillStyle = "white"
    context.fillRect(0, 0, canvas.width, canvas.height)
    if (!redraw) {
      setCurrentStroke([]);
      setUndoHistory([...undoHistory, {action: "Remove", strokes:[...strokes]}]);
      setStrokes([]);
    }
  }

  const getLatex = async () => {
    const config = {
      headers: {
        app_id: "mathpix_text_pdfs",
        app_key: "YB7Z96XEJF1NRKVDMZVE",
        "Content-Type": "application/json",
      }
    }
    var X = [];
    strokes.map(stroke => {X.push(stroke.map(point => point.x))});
    var Y = [];
    strokes.map(stroke => {Y.push(stroke.map(point => point.y))});
    
    return axios.post('https://api.mathpix.com/v3/strokes', 
    { 
      "strokes": {
        "strokes": {
          "x": X,
          "y": Y
        }
      }
    }, config)
  }

  return (
    <CanvasContext.Provider
      value={{
        canvasRef,
        contextRef,
        undoHistory,
        redoHistory,
        prepareCanvas,
        startDrawing,
        finishDrawing,
        leaveCanvas,
        clearCanvas,
        getLatex,
        draw,
        undo,
        redo,
      }}
    >
      {children}
    </CanvasContext.Provider>
  );
};

export const useCanvas = () => useContext(CanvasContext);