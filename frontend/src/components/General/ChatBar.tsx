import { useEffect, useState } from "react";
import type { Follower } from "../../types/followers";
import { getMyFollowers } from "../../api/chat.api";
import Spinner from "./Spinner";
import { Link } from "react-router-dom";

const ChatBar = () => {
  const [followers, setFollowers] = useState<Follower[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchFollowers = async () => {
      try {
        setLoading(true);
        const response = await getMyFollowers();
        setFollowers(response);
      } catch (error) {
        console.log("Failed to fetch your followers");
      } finally {
        setLoading(false);
      }
    };

    fetchFollowers();
  }, []);

  return (
    <div className="w-[300px] shrink-0 h-full border-l border-white/10 text-white flex flex-col">
      <h2 className="px-4 pb-3 text-lg font-semibold border-b border-white/10 my-4">
        Chats
      </h2>

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <Spinner />
        </div>
      ) : followers.length === 0 ? (
        <p className="text-sm text-white/60 text-center mt-6">
          No followers yet
        </p>
      ) : (
        <div className="flex-1 overflow-y-auto">
          {followers.map((user) => (
            <Link
              to={`chat/${user.username}/rcid/${user._id}`}
              key={user._id}
              className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 cursor-pointer transition"
              onClick={() => console.log("Open chat with", user._id)}
            >
              <img
                src={user.profileImage || "/avatar.png"}
                className="w-9 h-9 rounded-full object-cover"
                alt=""
              />
              <span className="text-sm font-medium">{user.username}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatBar;
