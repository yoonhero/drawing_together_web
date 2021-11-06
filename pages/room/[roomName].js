import { useRouter } from "next/router";
import { useState, useEffect, useContext } from "react";
import { SocketContext, useSocketConnection } from "../../utils/socket-context";

const Room = () => {
  const router = useRouter();
  const { roomName } = router.query;

  const socket = useContext(SocketContext);
  const connected = useSocketConnection();

  const [loading, setLoading] = useState(!connected);

  useEffect(() => {
    socket.emit("join_room", roomName);

    setLoading(true);

    socket.on("enter_room_success", () => {
      setLoading(false);
    });
  }, [roomName]);

  return (
    <div id='wrapper'>
      {loading ? (
        "Loading..."
      ) : (
        <>
          <canvas id='canvas'></canvas>
          <div id='controls'>
            <div id='widthControl' title='choose a line width'>
              <div className='widthExample'></div>
              <div className='widthExample'></div>
              <div className='widthExample'></div>
              <div className='widthExample'></div>
              <div className='widthExample'></div>
            </div>
            <div id='palette' title='choose a color'></div>

            <div id='clearBtn' title='clear the canvas'>
              <i className='fa fa-trash' aria-hidden='true'></i>
            </div>

            <div id='counterDiv' className='hidden'>
              <span id='counter'>0</span> users <br />
              are online
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Room;
