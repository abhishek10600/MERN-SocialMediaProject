import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { User, User2 } from "lucide-react";
import { logoutUser } from "../../api/auth.api";
import { toast } from "react-toastify";
import { logout } from "../../store/slices/authSlice";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);
  const [serverError, setServerError] = useState<string | null>(null);

  const handleLogout = async () => {
    try {
      const response = await logoutUser();
      toast.success(response.message);
      dispatch(logout());
      navigate("/login", { replace: true });
    } catch (error: any) {
      setServerError(error.message);
      toast.error(error.message);
    }
  };
  return (
    <nav className="min-h-[10vh] flex justify-between items-center px-4 py-4 md:px-20 md:py-4 border-b border-[#230737] shadow-[#230737] sticky">
      <Link to="/" className="text-[#9929EA] font-bold text-xl md:text-3xl">
        ConnectHub
      </Link>
      <div className="flex justify-center items-center gap-2">
        {user?.profileImage ? (
          <img
            className="w-7.5 rounded-2xl bg-cover aspect-square border-2 border-[#9929EA] object-cover"
            src={user?.profileImage}
          />
        ) : (
          <User2 className="text-white" />
        )}
        <span className="text-white">{user?.username}</span>
        <button
          onClick={handleLogout}
          className="bg-red-500 py-0.5 px-2 md:py-1 md:px-4 rounded-xl cursor-pointer hover:bg-red-700 hover:text-white"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
