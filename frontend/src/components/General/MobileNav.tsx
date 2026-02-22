import { Home, User2, MessageCircle, Menu } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { useEffect, useState } from "react";

import MobileChatDrawer from "./MobileChatDrawer";
import MobileSideDrawer from "./MobileSideDrawer";

const MobileNav = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  const [chatOpen, setChatOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const location = useLocation();

  useEffect(() => {
    setChatOpen(false);
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-white/10 flex justify-around py-3 lg:hidden z-[100]">
        <Link
          to="/"
          onClick={() => {
            setChatOpen(false);
            setMenuOpen(false);
          }}
        >
          <Home />
        </Link>

        <button
          onClick={() => {
            setMenuOpen(false);
            setChatOpen(true);
          }}
        >
          <MessageCircle />
        </button>

        <Link
          to={`/profile/${user?.username}`}
          onClick={() => {
            setChatOpen(false);
            setMenuOpen(false);
          }}
        >
          <User2 />
        </Link>

        <button
          onClick={() => {
            setChatOpen(false);
            setMenuOpen(true);
          }}
        >
          <Menu />
        </button>
      </div>

      <MobileChatDrawer open={chatOpen} onClose={() => setChatOpen(false)} />
      <MobileSideDrawer open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
};

export default MobileNav;
