import { useRouter } from "next/router";
import { useState, useEffect, useContext, useRef } from "react";
import Canvas from "../../components/customCanvas";
import { useCanvas } from "../../utils/CanvasContext";
import { SocketContext, useSocketConnection } from "../../utils/socket-context";

const Room = () => {
  const router = useRouter();
  const { roomName } = router.query;

  const socket = useContext(SocketContext);
  const connected = useSocketConnection();

  const [loading, setLoading] = useState(!connected);
  const [socketNumber, setSocketNumber] = useState(0);

  useEffect(() => {
    // socket.on("drawing", (color, width, startPos, endPos) => {
    //   ctx.beginPath();
    //   ctx.strokeStyle = color;
    //   ctx.lineWidth = width;
    //   ctx.lineJoin = "round";
    //   ctx.moveTo(...startPos);
    //   ctx.lineTo(...endPos);
    //   ctx.closePath();
    //   ctx.stroke();
    // })
    socket.on("clearCanvas", () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    });

    socket.on("socketNumber", (number) => {
      setSocketNumber(number);
    });

    return () => {
      socket.off();
    };
  }, []);

  useEffect(() => {
    socket.emit("join_room", roomName);

    setLoading(true);

    socket.on("enter_room_success", () => {
      setLoading(false);
    });
  }, [roomName]);

  useEffect(() => {
    setLoading(!connected);
  }, [connected]);

  return (
    <div id='wrapper'>
      {loading ? (
        "Loading..."
      ) : (
        <>
          <Canvas id='canvas' />
          <div id='controls'>
            <div id='widthControl' title='choose a line width'>
              <div className='widthExample'></div>
              <div className='widthExample'></div>
              <div className='widthExample'></div>
              <div className='widthExample'></div>
              <div className='widthExample'></div>
            </div>
            <div id='palette' title='choose a color'></div>
            {/* 
            <div id='clearBtn' title='clear the canvas' onClick={clearCanvas()}>
              <i className='fa fa-trash' aria-hidden='true'></i>
            </div> */}

            <div id='counterDiv'>
              <span id='counter'>{socketNumber}</span> users <br />
              are online
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Room;
