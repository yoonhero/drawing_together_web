import Head from "next/head";
import React, { useState, useEffect, useContext } from "react";
import { SubmitButton } from "../components/customButton";
import { CustomInput } from "../components/customInput";
import { SocketContext, useSocketConnection } from "../utils/socket-context";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";

export default function Home() {
  const router = useRouter();
  const socket = useContext(SocketContext);
  const connected = useSocketConnection();
  const [loading, setLoading] = useState(connected);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const joinRoom = (roomName) => {
    // enter the room
    router.push(`/room/${roomName}`);
  };

  useEffect(() => {
    return () => {
      socket.off();
    };
  }, []);

  useEffect(() => {
    setLoading(!connected);
  }, [connected]);

  const onSubmit = (data) => {
    joinRoom(data?.roomName);
  };

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
          <form
            onSubmit={handleSubmit(onSubmit)}
            className='flex flex-col items-center'>
            <div className='flex flex-col items-right  m-5 '>
              <label
                htmlFor='roomNumber_input'
                className='m-2 hidden text-xl font-bold text-gray-700 md:block'>
                회의참가
              </label>
              <CustomInput
                name='roomNumber_input'
                placeholder='Room Number'
                register={register("roomName", { required: true })}
              />
              {errors.roomName && (
                <span className='text-red-400 m-1'>This field is required</span>
              )}
            </div>
            <SubmitButton disabled={loading}>
              {!loading ? "참여" : "Loading..."}
            </SubmitButton>
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
