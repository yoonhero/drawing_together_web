import React, { useRef, useEffect, useContext, useState } from "react";
import { SocketContext } from "../utils/socket-context";

const Canvas = ({ roomName, lineWidth: lineW, drawColor: drawC }) => {
  const socket = useContext(SocketContext);
  const canvasRef = useRef(null);
  const [mousePressed, setMousePressed] = useState(false);
  const [lastPos, setLastPos] = useState(null);
  const [drawColor, setDrawColor] = useState(drawC);
  const [lineWidth, setLineWidth] = useState(lineW);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;

      const context = canvas.getContext("2d");
      context.lineCap = "round";
      context.strokeStyle = "black";
      context.lineWidth = 15;
    }

    socket.on("clearCanvas", () => {
      if (canvasRef.current) {
        canvasRef.current
          .getContext("2d")
          .clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    });

    socket.on("drawing", (color, width, startPos, endPos) => {
      if (canvasRef.current && color && width && startPos && endPos) {
        const ctx = canvasRef.current.getContext("2d");
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.lineJoin = "round";
        ctx.moveTo(...startPos);
        ctx.lineTo(...endPos);
        ctx.closePath();
        ctx.stroke();
      }
    });
  }, []);

  useEffect(() => {
    setLineWidth(lineW);
  }, [lineW]);

  useEffect(() => {
    setDrawColor(drawC);
  }, [drawC]);

  const mouseDown = (e) => {
    setMousePressed(true);
    drawing(e);
  };

  const mouseMove = (e) => {
    if (mousePressed) {
      drawing(e);
    }
  };

  const mouseOut = () => {
    setLastPos(null);
  };

  const mouseUp = (e) => {
    setMousePressed(false);
    setLastPos(null);
  };

  function drawing(e) {
    const [x, y] = mousePos(e);
    if (lastPos) {
      socket.emit("drawing", roomName, drawColor, lineWidth, lastPos, [x, y]);
      setLastPos([x, y]);
    } else {
      setLastPos([x, y]);
      socket.emit("drawing", roomName, drawColor, lineWidth, lastPos, [x, y]);
    }
  }

  function mousePos(e) {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      return [
        (e.clientX - rect.left) * (canvas.width / rect.width),
        (e.clientY - rect.top) * (canvas.height / rect.height),
      ];
    }
  }

  return (
    <canvas
      ref={canvasRef}
      onMouseDown={mouseDown}
      onMouseMove={mouseMove}
      onMouseUp={mouseUp}
      onMouseOut={mouseOut}
      onTouchStart={mouseDown}
      onTouchMove={mouseMove}
      onTouchEnd={mouseUp}
      onTouchCancel={mouseOut}
    />
  );
};

export default Canvas;
