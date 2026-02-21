import RegisterUserForm from "../components/AuthPageComponent/RegisterUserForm";

const RegisterPage = () => {
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
            Create Your Account
          </h2>

          <RegisterUserForm />
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
