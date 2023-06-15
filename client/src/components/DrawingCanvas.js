import React, { useRef, useEffect } from 'react';
import { fabric } from 'fabric';
import socket from '../services/socket';

const DrawingCanvas = ({ drawingData, onDrawingUpdate }) => {
  const canvasRef = useRef(null);
  let canvas;

  useEffect(() => {
    canvas = new fabric.Canvas(canvasRef.current, {
      isDrawingMode: true,
    });
    canvas.freeDrawingBrush.width = 5;

    // Add event listener for path creation
    canvas.on('path:created', (event) => {
      const path = event.path;
      const pathData = path.toObject();

      // Emit socket.io event for drawing update
      socket.emit('drawingUpdate', pathData);

      // Call the local onDrawingUpdate callback
      onDrawingUpdate(pathData);
    });

    // Cleanup function
    return () => {
      canvas.off('path:created');
    };
  }, []);

  useEffect(() => {
    // Clear canvas
    canvas.clear();

    // Redraw drawingData
    drawingData.forEach((pathData) => {
      const path = new fabric.Path(pathData.path);
      path.setOptions(pathData);
      canvas.add(path);
    });
  }, [drawingData]);

  return <canvas ref={canvasRef} />;
};

export default DrawingCanvas;
