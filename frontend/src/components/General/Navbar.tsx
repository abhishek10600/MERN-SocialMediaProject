import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { Search, User2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import type { SearchUser } from "../../types/seachUser";
import { searchUsers } from "../../api/feed.api";

const Navbar = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        const response = await searchUsers(query);
        setResults(response);
        setOpen(true);
      } catch (error) {
        console.error("Search error", error);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    // <nav className="min-h-[10vh] flex justify-between items-center px-4 py-4 md:px-20 md:py-4 border-b border-[#230737] shadow-[#230737] sticky">
    //   <Link to="/" className="text-[#9929EA] font-bold text-xl md:text-3xl">
    //     ConnectHub
    //   </Link>
    //   <div className="flex justify-center items-center gap-2">
    //     {user?.profileImage ? (
    //       <Link to={`/profile/${user?.username}`}>
    //         <img
    //           className="w-7.5 rounded-2xl bg-cover aspect-square border-2 border-[#9929EA] object-cover"
    //           src={user?.profileImage}
    //         />
    //       </Link>
    //     ) : (
    //       <User2 className="text-white" />
    //     )}
    //     <Link to={`/profile/${user?.username}`} className="text-white">
    //       {user?.username}
    //     </Link>
    //   </div>
    // </nav>

    <nav className="min-h-[10vh] flex justify-between items-center px-4 md:px-20 border-b border-[#230737]">
      {/* Logo */}
      <Link to="/" className="text-[#9929EA] font-bold text-xl md:text-3xl">
        ConnectHub
      </Link>

      {/* 🔍 Search */}
      <div
        ref={searchRef}
        className="relative w-[40%] max-w-md hidden md:block"
      >
        <div className="flex items-center bg-[#160023] border border-[#230737] rounded-xl px-3">
          <Search size={18} className="text-gray-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search users..."
            className="bg-transparent w-full px-3 py-2 text-white outline-none"
          />
        </div>

        {/* Dropdown */}
        {open && (
          <div className="absolute mt-2 w-full bg-[#160023] border border-[#230737] rounded-xl max-h-80 overflow-y-auto z-50">
            {loading && (
              <p className="text-center py-3 text-gray-400">Searching...</p>
            )}

            {!loading && results.length === 0 && (
              <p className="text-center py-3 text-gray-400">No users found</p>
            )}

            {!loading &&
              results.map((u) => (
                <Link
                  key={u._id}
                  to={`/profile/${u.username}`}
                  onClick={() => {
                    setOpen(false);
                    setQuery("");
                  }}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-[#230737]"
                >
                  {u.profileImage ? (
                    <img
                      src={u.profileImage}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <User2 className="text-white" />
                  )}
                  <div>
                    <p className="text-white font-medium">{u.username}</p>
                    {u.bio && (
                      <p className="text-gray-400 text-sm truncate w-56">
                        {u.bio}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
          </div>
        )}
      </div>

      {/* Profile */}
      <div className="flex items-center gap-2">
        {user?.profileImage ? (
          <Link to={`/profile/${user.username}`}>
            <img
              src={user.profileImage}
              className="w-8 h-8 rounded-full border-2 border-[#9929EA] object-cover"
            />
          </Link>
        ) : (
          <User2 className="text-white" />
        )}
        <Link to={`/profile/${user?.username}`} className="text-white">
          {user?.username}
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
