import { useRouter } from "next/router";
import { useState, useEffect, useContext, useRef } from "react";
import Canvas from "../../components/customCanvas";
import { SocketContext, useSocketConnection } from "../../utils/socket-context";

const Room = () => {
  const router = useRouter();
  const { roomName } = router.query;

  const socket = useContext(SocketContext);
  const connected = useSocketConnection();

  const [loading, setLoading] = useState(!connected);

  const [socketNumber, setSocketNumber] = useState(0);

  useEffect(() => {
    // document.querySelectorAll(".colorSquare").forEach((square) => {
    //   square.addEventListener("click", () => {
    //     drawColor = square.style.backgroundColor;
    //     document.querySelectorAll(".widthExample").forEach((ex) => {
    //       ex.style.backgroundColor = drawColor;
    //     });
    //   });
    // });

    // document.querySelectorAll(".widthExample").forEach((ex) => {
    //   ex.addEventListener("click", () => {
    //     lineWidth = ex.clientWidth;
    //     document.querySelectorAll(".widthExample").forEach((other) => {
    //       other.style.opacity = 0.4;
    //     });
    //     ex.style.opacity = 1;
    //   });
    // })

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

  const clearCanvas = () => {
    socket.emit("clearCanvas", roomName);
  };

  return (
    <div id='wrapper'>
      {loading ? (
        "Loading..."
      ) : (
        <>
          <Canvas roomName={roomName} />
          <div id='controls'>
            <div id='widthControl' title='choose a line width'>
              <div className='widthExample'></div>
              <div className='widthExample'></div>
              <div className='widthExample'></div>
              <div className='widthExample'></div>
              <div className='widthExample'></div>
            </div>
            <div id='palette' title='choose a color'></div>

            <div
              id='clearBtn'
              title='clear the canvas'
              onClick={() => clearCanvas()}>
              <i className='fa fa-trash' aria-hidden='true'></i>
            </div>

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
