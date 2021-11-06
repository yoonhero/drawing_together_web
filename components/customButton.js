export const SubmitButton = ({ disabled, children }) => {
  return (
    <button
      type='submit'
      className={`bg-blue-800 text-white m-2 px-8 py-4 rounded-xl font-md font-sans text-2xl shadow-md md:hover:shadow-xl transition transform md:hover:scale-105 ${
        disabled && "animate-ping m-10"
      }`}
      disabled={disabled}>
      {children}
    </button>
  );
};
