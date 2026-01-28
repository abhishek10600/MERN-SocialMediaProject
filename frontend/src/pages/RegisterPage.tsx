import RegisterUserForm from "../components/AuthPageComponent/RegisterUserForm";

const RegisterPage = () => {
  return (
    <div className="bg-[#000000] h-screen flex flex-col md:gap-10 items-center overflow-hidden">
      <div className="flex flex-col items-center md:gap-5 md:pt-12">
        <h1 className="md:text-5xl text-[#9929EA] font-bold">
          Welcome To ConnectHub
        </h1>
        <p className="text-white md:text-2xl">A Place To Flex Your Creation</p>
      </div>
      <div className="flex flex-col  md:w-1/2 md:p-4 rounded-xl shadow-2xl shadow-[#230737]">
        <h1 className="text-white text-xl md:mb-4">Create Your Account</h1>
        <RegisterUserForm />
      </div>
    </div>
  );
};

export default RegisterPage;
