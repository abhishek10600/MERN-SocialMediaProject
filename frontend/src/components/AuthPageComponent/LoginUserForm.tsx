import { Link } from "react-router-dom";

const LoginUserForm = () => {
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
        <label className="text-[#9929EA]">Password</label>
        <input
          type="password"
          placeholder="create your password"
          className="text-white md:p-2 border rounded-xl"
        />
      </div>
      <Link to="/register" className="text-[#9929EA]">
        Don't have an account?
      </Link>
      <button className="bg-[#9929EA] md:py-2 rounded-xl font-bold hover:bg-[#7b14c4] cursor-pointer ease-in-out duration-200">
        Login
      </button>
    </form>
  );
};

export default LoginUserForm;
