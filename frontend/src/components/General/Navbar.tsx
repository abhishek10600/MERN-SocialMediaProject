// import { useSelector } from "react-redux";
// import type { RootState } from "../../store/store";
// import { Search, User2 } from "lucide-react";
// import { Link } from "react-router-dom";
// import { useEffect, useRef, useState } from "react";
// import { searchPosts } from "../../api/post.api";
// import type { SearchPost } from "../../types/searchPost";

// const Navbar = () => {
//   const user = useSelector((state: RootState) => state.auth.user);
//   const [query, setQuery] = useState("");
//   const [results, setResults] = useState<SearchPost[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [open, setOpen] = useState(false);
//   const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

//   const searchRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     if (!query.trim()) {
//       setResults([]);
//       return;
//     }

//     const timer = setTimeout(async () => {
//       try {
//         setLoading(true);
//         const response = await searchPosts(query);
//         setResults(response);
//         setOpen(true);
//       } catch (error) {
//         console.error("Search error", error);
//       } finally {
//         setLoading(false);
//       }
//     }, 400);

//     return () => clearTimeout(timer);
//   }, [query]);

//   useEffect(() => {
//     const handleClickOutside = (e: MouseEvent) => {
//       if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
//         setOpen(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   return (
//     <nav className="h-[60px] flex justify-between items-center px-4 md:px-20 border-b border-[#230737]">
//       <Link to="/" className="text-[#9929EA] font-bold text-xl md:text-3xl">
//         ConnectHub
//       </Link>

//       {/* Search */}
//       <div
//         ref={searchRef}
//         className="relative w-[50%] max-w-md hidden sm:block"
//       >
//         <div className="flex items-center bg-[#160023] border border-[#230737] rounded-xl px-3">
//           <Search size={18} className="text-gray-400" />
//           <input
//             value={query}
//             onChange={(e) => setQuery(e.target.value)}
//             placeholder="Search"
//             className="bg-transparent w-full px-3 py-2 text-white outline-none"
//           />
//         </div>

//         {open && (
//           <div className="absolute mt-2 w-full bg-[#160023] border border-[#230737] rounded-xl max-h-80 overflow-y-auto z-50">
//             {loading && (
//               <p className="text-center py-3 text-gray-400">Searching...</p>
//             )}

//             {!loading &&
//               results.map((p) => (
//                 <Link
//                   key={p._id}
//                   to={`/${p._id}`}
//                   onClick={() => {
//                     setOpen(false);
//                     setQuery("");
//                   }}
//                   className="flex items-center gap-3 px-4 py-3 hover:bg-[#230737]"
//                 >
//                   {p.owner.profileImage ? (
//                     <img
//                       src={p.owner.profileImage}
//                       className="w-10 h-10 rounded-full object-cover"
//                     />
//                   ) : (
//                     <User2 className="text-white" />
//                   )}

//                   <div className="min-w-0">
//                     <p className="text-white font-medium truncate">
//                       {p.owner.username}
//                     </p>
//                     {p.content && (
//                       <p
//                         className="text-gray-400 text-sm truncate"
//                         dangerouslySetInnerHTML={{ __html: p.content }}
//                       />
//                     )}
//                   </div>
//                 </Link>
//               ))}
//           </div>
//         )}
//       </div>

//       {/* Profile */}
//       <div className="flex items-center gap-2">
//         <Search className="text-white sm:hidden" size={22} />

//         {user?.profileImage ? (
//           <Link to={`/profile/${user.username}`}>
//             <img
//               src={user.profileImage}
//               className="w-8 h-8 rounded-full border-2 border-[#9929EA] object-cover"
//             />
//           </Link>
//         ) : (
//           <User2 className="text-white" />
//         )}
//       </div>
//     </nav>
//   );
// };

// export default Navbar;

import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { Search, User2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { searchPosts } from "../../api/post.api";
import type { SearchPost } from "../../types/searchPost";

const Navbar = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);

  /* ---------------- SEARCH (DEBOUNCE) ---------------- */
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        const response = await searchPosts(query);
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

  /* ---------------- CLICK OUTSIDE ---------------- */
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
    <>
      {/* ================= NAVBAR ================= */}
      <nav className="h-[60px] flex justify-between items-center px-4 md:px-20 border-b border-[#230737]">
        <Link to="/" className="text-[#9929EA] font-bold text-xl md:text-3xl">
          ConnectHub
        </Link>

        {/* -------- Desktop Search -------- */}
        <div
          ref={searchRef}
          className="relative w-[50%] max-w-md hidden sm:block"
        >
          <div className="flex items-center bg-[#160023] border border-[#230737] rounded-xl px-3">
            <Search size={18} className="text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search"
              className="bg-transparent w-full px-3 py-2 text-white outline-none"
            />
          </div>

          {open && (
            <div className="absolute mt-2 w-full bg-[#160023] border border-[#230737] rounded-xl max-h-80 overflow-y-auto z-50">
              {loading && (
                <p className="text-center py-3 text-gray-400">Searching...</p>
              )}

              {!loading &&
                results.map((p) => (
                  <Link
                    key={p._id}
                    to={`/${p._id}`}
                    onClick={() => {
                      setOpen(false);
                      setQuery("");
                    }}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-[#230737]"
                  >
                    {p.owner.profileImage ? (
                      <img
                        src={p.owner.profileImage}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <User2 className="text-white" />
                    )}

                    <div className="min-w-0">
                      <p className="text-white font-medium truncate">
                        {p.owner.username}
                      </p>

                      {p.content && (
                        <p
                          className="text-gray-400 text-sm truncate"
                          dangerouslySetInnerHTML={{ __html: p.content }}
                        />
                      )}
                    </div>
                  </Link>
                ))}
            </div>
          )}
        </div>

        {/* -------- Profile + Mobile Search -------- */}
        <div className="flex items-center gap-2">
          {/* Mobile Search Icon */}
          <Search
            className="text-white sm:hidden cursor-pointer"
            size={22}
            onClick={() => setMobileSearchOpen(true)}
          />

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
        </div>
      </nav>

      {/* ================= MOBILE SEARCH OVERLAY ================= */}
      {mobileSearchOpen && (
        <div className="fixed inset-0 bg-[#0b0b0f] z-[100] p-4 sm:hidden">
          <div ref={searchRef} className="relative">
            {/* Input */}
            <div className="flex items-center bg-[#160023] border border-[#230737] rounded-xl px-3">
              <Search size={18} className="text-gray-400" />

              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search"
                className="bg-transparent w-full px-3 py-3 text-white outline-none"
              />

              {/* Close */}
              <button
                onClick={() => {
                  setMobileSearchOpen(false);
                  setQuery("");
                  setOpen(false);
                }}
                className="text-gray-400 text-lg px-2"
              >
                ✕
              </button>
            </div>

            {/* Results */}
            {open && (
              <div className="mt-3 bg-[#160023] border border-[#230737] rounded-xl max-h-[70vh] overflow-y-auto">
                {loading && (
                  <p className="text-center py-3 text-gray-400">Searching...</p>
                )}

                {!loading &&
                  results.map((p) => (
                    <Link
                      key={p._id}
                      to={`/${p._id}`}
                      onClick={() => {
                        setMobileSearchOpen(false);
                        setOpen(false);
                        setQuery("");
                      }}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-[#230737]"
                    >
                      {p.owner.profileImage ? (
                        <img
                          src={p.owner.profileImage}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <User2 className="text-white" />
                      )}

                      <div className="min-w-0">
                        <p className="text-white font-medium truncate">
                          {p.owner.username}
                        </p>

                        {p.content && (
                          <p
                            className="text-gray-400 text-sm truncate"
                            dangerouslySetInnerHTML={{
                              __html: p.content,
                            }}
                          />
                        )}
                      </div>
                    </Link>
                  ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
