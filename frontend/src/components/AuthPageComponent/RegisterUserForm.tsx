import { Link } from "react-router-dom";

const RegisterUserForm = () => {
  return (
    <form className="border flex flex-col md:gap-3 md:text-sm">
      <div className="flex flex-col md:gap-2">
        <label className="text-[#9929EA]">Username</label>
        <input
          type="text"
          placeholder="create your username"
          className="text-white md:p-2 border rounded-xl"
        />
      </div>
      <div className="flex flex-col md:gap-2">
        <label className="text-[#9929EA]">Email</label>
        <input
          type="email"
          placeholder="enter your email"
          className="text-white md:p-2 border rounded-xl"
        />
      </div>

      <div className="flex flex-col md:gap-2">
        <label className="text-[#9929EA]">Password</label>
        <input
          type="password"
          placeholder="create your password"
          className="text-white md:p-2 border rounded-xl"
        />
      </div>

      <div className="flex flex-col md:gap-2">
        <label className="text-[#9929EA]">Profile Picture</label>
        <input
          type="file"
          className="text-white md:p-2 border rounded-xl hover:bg-[#131313] cursor-pointer"
        />
      </div>
      <Link to="/login" className="text-[#9929EA]">
        Already have an account?
      </Link>
      <button className="bg-[#9929EA] md:py-2 rounded-xl font-bold hover:bg-[#7b14c4] cursor-pointer ease-in-out duration-200">
        Register
      </button>
    </form>
  );
};

export default RegisterUserForm;
