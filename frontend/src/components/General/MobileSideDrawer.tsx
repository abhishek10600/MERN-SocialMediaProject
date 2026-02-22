import { Link } from "react-router-dom";
import { X, Home, User2, LogOut } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../store/store";
import { logout } from "../../store/slices/authSlice";
import { logoutUser } from "../../api/auth.api";

interface Props {
  open: boolean;
  onClose: () => void;
}

const MobileSidebarDrawer = ({ open, onClose }: Props) => {
  const user = useSelector((s: RootState) => s.auth.user);
  const dispatch = useDispatch();

  const handleLogout = async () => {
    await logoutUser();
    dispatch(logout());
  };

  if (!open) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bottom-16 z-[90] bg-black flex flex-col h-full">
      <div className="flex justify-between items-center p-4 border-b border-white/10">
        <h2 className="font-semibold">Menu</h2>
        <X onClick={onClose} />
      </div>

      <div className="flex flex-col gap-4 p-6">
        <Link to="/" onClick={onClose} className="flex gap-2">
          <Home /> Home
        </Link>

        <Link
          to={`/profile/${user?.username}`}
          onClick={onClose}
          className="flex gap-2"
        >
          <User2 /> Profile
        </Link>

        <button onClick={handleLogout} className="flex gap-2 text-red-500">
          <LogOut /> Logout
        </button>
      </div>
    </div>
  );
};

export default MobileSidebarDrawer;
