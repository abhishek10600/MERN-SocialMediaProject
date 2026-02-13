import { useEffect, useState } from "react";
import type { Conversation } from "../../types/chat";
import { getUserConversations } from "../../api/chat.api";
import Spinner from "./Spinner";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootState } from "../../store/store";

const ChatBar = () => {
  const loggedInUser = useSelector((state: RootState) => state.auth.user);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadConversations = async () => {
      try {
        setLoading(true);
        const response = await getUserConversations();
        setConversations(response);
      } catch (error) {
        console.log("Failed to fetch your followers");
      } finally {
        setLoading(false);
      }
    };

    loadConversations();
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
      ) : conversations.length === 0 ? (
        <p className="text-sm text-white/60 text-center mt-6">
          No conversations yet
        </p>
      ) : (
        <div className="flex-1 overflow-y-auto">
          {conversations.map((conv) => {
            const otherUser = conv.participants.find(
              (p) => p._id !== loggedInUser?._id,
            );
            return (
              <div
                key={conv._id}
                onClick={() => navigate(`/chat/${otherUser?._id}`)}
                className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 cursor-pointer transition"
                // onClick={() => console.log("Open chat with", otherUser?._id)}
              >
                <img
                  src={otherUser?.profileImage || "/avatar.png"}
                  className="w-9 h-9 rounded-full object-cover"
                  alt=""
                />
                <span className="text-sm font-medium">
                  {otherUser?.username}
                </span>
                <span className="text-sm text-white/60 truncate max-w-[160px]">
                  {conv.lastMessage?.text || "Image"}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ChatBar;
