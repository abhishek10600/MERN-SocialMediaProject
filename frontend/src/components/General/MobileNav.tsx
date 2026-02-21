import { Home, User2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";

const MobileNav = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-white/10 flex justify-around py-3 lg:hidden z-50">
      <Link to="/">
        <Home className="text-white" />
      </Link>

      <Link to={`/profile/${user?.username}`}>
        <User2 className="text-white" />
      </Link>
    </div>
  );
};

export default MobileNav;
