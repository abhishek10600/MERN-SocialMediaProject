import LoginUserForm from "../components/AuthPageComponent/LoginUserForm";

const LoginPage = () => {
  //   return (
  //     <div className="h-screen flex flex-col gap-5 md:gap-10 items-center">
  //       <div className="flex flex-col items-center gap-2 md:gap-5 pt-12">
  //         <h1 className="text-2xl md:text-5xl text-[#9929EA] font-bold">
  //           Welcome To ConnectHub
  //         </h1>
  //         <p className="text-white md:text-2xl">A Place To Flex Your Creation</p>
  //       </div>
  //       <div className="flex flex-col w-87 md:w-1/2 p-4 rounded-xl shadow-2xl shadow-[#230737]">
  //         <h1 className="text-white md:text-xl mb-4">Login To Your Account</h1>
  //         <LoginUserForm />
  //       </div>
  //     </div>
  //   );
  // };

  return (
    <div className="h-screen flex items-center justify-center px-4 bg-[#0b0b0f] relative overflow-hidden">
      {/* background glow */}
      <div className="absolute pointer-events-none w-[500px] h-[500px] bg-[#9929EA]/20 blur-[120px] rounded-full top-[-150px]" />

      <div className="relative w-full max-w-md md:max-w-lg">
        {/* Heading */}
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-[#9929EA]">
            ConnectHub
          </h1>

          <p className="text-gray-400 mt-1 text-sm">
            A Place To Flex Your Creation
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#111115] border border-[#1f1f25] rounded-2xl p-5 md:p-6 shadow-2xl shadow-[#230737]/40">
          <h2 className="text-white text-lg font-semibold mb-4 text-center">
            Login To Your Account
          </h2>

          {/* <RegisterUserForm /> */}
          <LoginUserForm />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
