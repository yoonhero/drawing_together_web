export const CustomInput = ({ name, placeholder, register }) => {
  return (
    <input
      id={name}
      name={name}
      type='text'
      placeholder={placeholder}
      className='form-input shadow-md  min-w-full px-3 py-4 rounded-2xl outline-none text-3xl text-left text-gray-800 placeholder-gray-600 transition transform md:hover:scale-105 focus:outline-none active:outline-none'
      {...register}
    />
  );
};
