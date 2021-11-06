import Head from "next/head";
import React, { useState, useEffect, useContext } from "react";
import { SubmitButton } from "../components/customButton";
import { CustomInput } from "../components/customInput";
import { SocketContext, useSocketConnection } from "../utils/socket-context";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  const socket = useContext(SocketContext);
  const [loading, setLoading] = useState(socket.connected);
  const connected = useSocketConnection();

  const sendData = () => {
    socket.emit("hello", "hi", "myname", "yoonhero");

    socket.on("metoo", (data) => {
      console.log(data);
    });
  };

  const joinRoom = (roomName) => {
    socket.emit("join_room", roomName);

    setLoading(true);

    socket.on("enter_room_success", () => {
      setLoading(false);
    });

    // enter the room
    router.push(`/room/${roomName}`);
  };

  useEffect(() => {
    console.log(connected);

    return () => {
      socket.off();
    };
  }, []);

  useEffect(() => {
    setLoading(!connected);

    if (connected) {
      sendData();
    }
  }, [connected]);

  return (
    <main>
      <Head>
        <title>Draw Together</title>
        <meta name='description' content='Drawing Together' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <section className='flex flex-col items-center justify-center w-screen h-screen'>
        <section className='flex p-10'>
          <h1 className='font-sans text-5xl font-extrabold tracking-wide text-blue-900 text-opacity-90 md:hover:text-opacity-100 sm:font-bold sm:tracking-normal'>
            Draw Together
          </h1>
        </section>

        <section className='flex flex-col items-center justify-center p-5'>
          <form className='flex flex-col items-center'>
            <div className='flex flex-col items-right  m-5 '>
              <label
                for='roomNumber_input'
                className='m-2 hidden text-xl font-bold text-gray-700 md:block'>
                회의참가
              </label>
              <CustomInput name='roomNumber_input' placeholder='Room Number' />
            </div>
            <SubmitButton>참여</SubmitButton>
          </form>

          <section className='m-10 flex flex-row items-center justify-around text-xl font-semibold text-gray-700 font-sans'>
            <span>or</span>
            <button className='m-2'>방 만들기</button>
          </section>
        </section>
      </section>
    </main>
  );
}
