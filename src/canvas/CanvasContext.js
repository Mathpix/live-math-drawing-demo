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
  const [checkStrikeThroughFlag, setCheckStrikeThroughFlag] = useState(false);
  const [renderLatexTimeout, setRenderLatexTimeout] = useState(null);
  const [renderLatexFlag, setRenderLatexFlag] = useState(false);
  const [latexCode, setLatexCode] = useState('LaTeX code');
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
    context.lineWidth = 6;
    contextRef.current = context;
  };

  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.lineJoin = "round";
    contextRef.current.lineCap = "round";
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    setCurrentStroke({
      points: [{x: offsetX, y: offsetY}],
      minX: offsetX,
      minY: offsetY,
      maxX: offsetX,
      maxY: offsetY,
      timestamp: Date.now()
    });
    setIsDrawing(true);
  };

  const draw = ({ nativeEvent }) => {
    if (!isDrawing) {
      return;
    }
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
    const minX = Math.min(offsetX, currentStroke.minX);
    const minY = Math.min(offsetY, currentStroke.minY);
    const maxX = Math.max(offsetX, currentStroke.maxX);
    const maxY = Math.max(offsetY, currentStroke.maxY);

    setCurrentStroke({
      points: [...currentStroke.points,{x: offsetX, y: offsetY}],
      minX: minX,
      minY: minY,
      maxX: maxX,
      maxY: maxY,
      timestamp: Date.now()
    });
  };

  const finishDrawing = () => {
    setStrokes([...strokes, currentStroke]);
    contextRef.current.closePath();
    setIsDrawing(false);
    setCheckStrikeThroughFlag(!checkStrikeThroughFlag);
  };

  useEffect(() => {
    redraw();
    setRenderLatexFlag(!renderLatexFlag);
  }, [redrawFlag]);

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

  useEffect(() => {
    var removeStrokes = [];
    strokes.slice(0,-1).forEach(stroke => {
      if (isAfterStrikeThroughCooldown(currentStroke, stroke) && isOverIntersectingThreshold(currentStroke, stroke) && isStraightLine(currentStroke)) {
        removeStrokes.push(stroke);
      }
      else if (isAfterStrikeThroughCooldown(currentStroke, stroke) && isOverIntersectingThreshold(currentStroke, stroke) && isSribble(currentStroke)){
        removeStrokes.push(stroke);
      }
    });
    if (removeStrokes.length > 0) {
      removeStrokes.push(currentStroke);
      setStrokes(strokes.filter(stroke => !removeStrokes.includes(stroke)));
      setUndoHistory([...undoHistory, {action: "Remove", strokes: removeStrokes.slice(0,-1)}]);
      setRedoHistory([]);
      setRedrawFlag(!redrawFlag);
    }
    else{
      setUndoHistory([...undoHistory, {action: "Add", strokes:[currentStroke]}]);
      setRedoHistory([]);
    }
    setRenderLatexFlag(!renderLatexFlag);
  }, [checkStrikeThroughFlag]);

  const isAfterStrikeThroughCooldown = (newStroke, oldStroke) => {
    return (newStroke.timestamp - oldStroke.timestamp) > 2000;
  };

  const isOverIntersectingThreshold = (newStroke, oldStroke) => {
    return IOU(newStroke, oldStroke) > 0.85;
  };

  const isStraightLine = (newStroke) => {
    return getDistanceRatio(newStroke) > 0.90;
  };

  const isSribble = (newStroke) => {
    return getDistanceRatio(newStroke) < 0.3;
  };

  const getDistanceRatio = (newStroke) => {
    var totalLength = 0;
    newStroke.points.forEach((point, index) => {
      if (index > 0) {
        const previousPoint = newStroke.points[index - 1];
        totalLength += Math.sqrt(Math.pow(point.x - previousPoint.x, 2) + Math.pow(point.y - previousPoint.y, 2));
      }
    });
    const endpointLength = Math.sqrt(Math.pow(newStroke.points[0].x - newStroke.points[newStroke.points.length - 1].x, 2) + Math.pow(newStroke.points[0].y - newStroke.points[newStroke.points.length - 1].y, 2));
    return endpointLength / totalLength
  }


  const IOU = (newStroke, oldStroke) => {
    const xA = Math.max(newStroke.minX, oldStroke.minX);
    const yA = Math.max(newStroke.minY, oldStroke.minY);
    const xB = Math.min(newStroke.maxX, oldStroke.maxX);
    const yB = Math.min(newStroke.maxY, oldStroke.maxY);

    const intersectionArea = Math.max(0, xB - xA+1) * Math.max(0, yB - yA+1);

    
    const box2area = (oldStroke.maxX - oldStroke.minX + 1) * (oldStroke.maxY - oldStroke.minY + 1);

    const iou = intersectionArea / (box2area);
    
    return iou;
  }

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
    clearCanvas();
    strokes.forEach(stroke => {
      stroke.points.forEach((point, index) => {
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


  const leaveCanvas = () => {
    if (isDrawing) {
      finishDrawing();
    }
  }

  const clearCanvas = (redraw=true) => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d")
    context.fillStyle = "white"
    context.fillRect(0, 0, canvas.width, canvas.height)
    if (!redraw) {
      setCurrentStroke([]);
      setUndoHistory([...undoHistory, {action: "Remove", strokes:[...strokes]}]);
      setRedoHistory([]);
      setStrokes([]);
    }
    setRenderLatexFlag(!renderLatexFlag);
  }

  useEffect (() => {
    if (strokes.length > 0) {
      getLatexTimedOut(100);
    } else {
      setLatexCode('LaTeX code');
    }
  }, [renderLatexFlag]);

  const getLatexTimedOut = (time) => {
    clearTimeout(renderLatexTimeout);
    setRenderLatexTimeout (
      setTimeout(async () => {
        const response = await getLatex();
        if (!response.data.error) {
          if (response.data.latex_styled) {
            setLatexCode(`\\[${response.data.latex_styled}\\]`);
          }
          else {
            setLatexCode(response.data.text);
          }
        } else {
          console.log("API Error: ", response.data.error);
        }
      }, time)
    )
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
    strokes.map(stroke => {X.push(stroke.points.map(point => point.x))});
    var Y = [];
    strokes.map(stroke => {Y.push(stroke.points.map(point => point.y))});
    
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
        latexCode,
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