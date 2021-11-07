import Head from "next/head";
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

  const [lineWidth, setLineWidth] = useState(15);

  useEffect(() => {
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
      socket.emit("disconnect", roomName);
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
    <>
      <Head>
        <link
          rel='stylesheet'
          href='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.13.0/css/all.min.css'
          integrity='sha256-h20CPZ0QyXlBuAw7A+KluUYx/3pK+c7lYEpqLTlxjYQ='
          crossorigin='anonymous'
        />
      </Head>
      <div id='wrapper'>
        {loading ? (
          "Loading..."
        ) : (
          <>
            <Canvas roomName={roomName} lineWidth={lineWidth} />
            <div id='controls'>
              <div id='widthControl' title='choose a line width'>
                {[1, 2, 3, 4, 5].map((w) => {
                  return (
                    <div
                      className='widthExample'
                      style={{
                        width: w * 5,
                        height: w * 5,
                        opacity: `${lineWidth === w * 5 ? 1 : 0.4}`,
                      }}
                      onClick={(e) => {
                        setLineWidth(w * 5);
                      }}></div>
                  );
                })}
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
    </>
  );
};

export default Room;
