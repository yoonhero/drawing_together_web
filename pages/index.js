import Head from "next/head";

export default function Home() {
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
              <input
                id='roomNumber_input'
                name='roomNumber_input'
                type='text'
                placeholder='Room Number'
                class='form-input shadow-md  min-w-full px-3 py-4 rounded-2xl outline-none text-3xl text-left text-gray-800 placeholder-gray-600 transition transform md:hover:scale-105 focus:outline-none active:outline-none'
              />
            </div>

            <button
              type='submit'
              className='bg-blue-800 text-white m-2 px-8 py-4 rounded-xl font-md font-sans text-2xl shadow-md md:hover:shadow-xl transition transform md:hover:scale-105'>
              참여
            </button>
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
