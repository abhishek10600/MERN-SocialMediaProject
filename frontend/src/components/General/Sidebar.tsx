import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router-dom";
import type { RootState } from "../../store/store";
import { logoutUser } from "../../api/auth.api";
import { toast } from "react-toastify";
import { logout } from "../../store/slices/authSlice";
import { useState } from "react";
import { Home, LogOut, User2 } from "lucide-react";

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
  const loggedInUser = useSelector((state: RootState) => state.auth.user);

  const baseClasses =
    "border border-white/20 text-white px-4 py-2 rounded-xl text-sm font-semibold transition cursor-pointer flex gap-1 justify-center items-center hover:scale-[1.02]";

  const inactiveClasses = "bg-white/20 border-white";
  const activeClasses = "bg-[#9929EA]";
  return (
    // <div className="w-65 shrink-0 h-full border-r border-white/10 text-white flex flex-col items-center justify-between py-6">
    <div className="hidden lg:flex w-64 shrink-0 h-full border-r border-white/10 text-white flex-col items-center justify-between py-6">
      <div className="flex flex-col gap-4">
        <NavLink
          to={`/`}
          end
          className={({ isActive }) =>
            `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`
          }
        >
          <Home size={18} />
          Home
        </NavLink>
        <NavLink
          to={`/profile/${loggedInUser?.username}`}
          end
          className={({ isActive }) =>
            `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`
          }
        >
          <User2 size={18} />
          Profile
        </NavLink>
      </div>
      <div>
        <button
          onClick={handleLogout}
          className="border border-white/20 text-white hover:bg-white/10 bg-red-600 px-4 py-2 rounded-xl text-sm font-semibold transition disabled:opacity-50 cursor-pointer hover:scale-[1.02] flex items-center justify-center gap-1"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
