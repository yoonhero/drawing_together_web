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

  const touchStart = (e) => {
    setMousePressed(true);
    drawing(e, true);
  };

  const touchMove = (e) => {
    if (mousePressed) {
      drawing(e, true);
    }
  };

  const touchCancel = () => {
    setLastPos(null);
  };

  const touchEnd = (e) => {
    setMousePressed(false);
    setLastPos(null);
  };

  function drawing(e, mobile = false) {
    const [x, y] = mousePos(e, mobile);
    if (lastPos) {
      socket.emit("drawing", roomName, drawColor, lineWidth, lastPos, [x, y]);
      setLastPos([x, y]);
    } else {
      setLastPos([x, y]);
      socket.emit("drawing", roomName, drawColor, lineWidth, lastPos, [x, y]);
    }
  }

  function mousePos(e, mobile = false) {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();

      if (mobile) {
        let touches = e.changedTouches;

        for (let i = 0; i < touches?.length; i++) {
          return [
            (touches[i].clientX - rect.left) * (canvas.width / rect.width),
            (touches[i].clientY - rect.top) * (canvas.height / rect.height),
          ];
        }
      }

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
      onTouchStart={touchStart}
      onTouchMove={touchMove}
      onTouchEnd={touchEnd}
      onTouchCancel={touchCancel}
    />
  );
};

export default Canvas;
