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
  const [drawColor, setDrawColor] = useState("black");

  const COLORS = [
    "black",
    "gray",
    "silver",
    "white",
    "lightblue",
    "cyan",
    "blue",
    "darkblue",
    "purple",
    "magenta",
    "red",
    "orange",
    "yellow",
    "lime",
    "green",
    "olive",
    "brown",
    "maroon",
  ];

  useEffect(() => {
    socket.on("socketNumber", (number) => {
      setSocketNumber(number);
    });

    return () => {
      socket.emit("leave_room", roomName);
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
      <div className='flex flex-col items-center justify-center w-screen h-screen'>
        {loading ? (
          "Loading..."
        ) : (
          <>
            <Canvas
              roomName={roomName}
              lineWidth={lineWidth}
              drawColor={drawColor}
            />
            <div className='absolute right-0 h-screen p-3 flex flex-col items-center justify-around bg-gray-200'>
              <div
                title='선 굵기 선택하기'
                className='flex flex-col items-center justify-center m-2'>
                {[1, 2, 3, 4, 5].map((w) => {
                  return (
                    <div
                      key={w}
                      className='shadowed rounded-full transition transform hover:scale-110 hover:opacity-100'
                      style={{
                        backgroundColor: drawColor,
                        width: w * 7,
                        height: w * 7,
                        margin: 1,
                        opacity: `${lineWidth === w * 5 ? 1 : 0.3}`,
                      }}
                      onClick={() => {
                        setLineWidth(w * 5);
                      }}></div>
                  );
                })}
              </div>
              <div title='choose a color'>
                {COLORS.map((c) => {
                  return (
                    <div
                      key={c}
                      style={{ backgroundColor: c, margin: 2 }}
                      className='w-8 h-8 rounded-md transform transition hover:rounded-full hover:scale-110'
                      onClick={() => {
                        setDrawColor(c);
                      }}></div>
                  );
                })}
              </div>

              <div
                className='text-xl transition transform opacity-80 hover:text-red-600 hover:scale-110 hover:opacity-100'
                title='Clear Canvas'
                onClick={() => clearCanvas()}>
                <i className='fa fa-trash' aria-hidden='true'></i>
              </div>

              {/* <div id='counterDiv'>
                <span id='counter'>{socketNumber}</span> users <br />
                are online
              </div> */}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Room;
