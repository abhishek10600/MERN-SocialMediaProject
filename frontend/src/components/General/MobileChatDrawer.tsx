import { useEffect, useState } from "react";
import type { Conversation } from "../../types/chat";
import { getUserConversations } from "../../api/chat.api";
import { getSocket } from "../../socket";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import AppLayout from "../Layout/AppLayout";

interface Props {
  open: boolean;
  onClose: () => void;
}

const MobileChatDrawer = ({ open, onClose }: Props) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const loggedInUser = useSelector((s: RootState) => s.auth.user);
  const navigate = useNavigate();

  const loadConversations = async () => {
    const res = await getUserConversations();
    setConversations(res);
  };

  useEffect(() => {
    if (!open) return;

    loadConversations();

    const socket = getSocket();
    socket?.on("conversation_updated", loadConversations);

    return () => {
      socket?.off("conversation_updated", loadConversations);
    };
  }, [open]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  if (!open) return null;

  return (
    // <div className="fixed inset-0 z-50 bg-black">
    // <div className="fixed top-0 left-0 right-0 bottom-16 z-50 bg-black">
    // <div className="fixed top-0 left-0 right-0 bottom-16 z-[90] bg-black">
    // <div className="fixed inset-0 z-[200] bg-black flex flex-col">
    <div className="fixed top-0 left-0 right-0 bottom-16 z-[90] bg-black flex flex-col h-full">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-white/10">
        <h2 className="text-lg font-semibold">Chats</h2>
        <X onClick={onClose} className="cursor-pointer" />
      </div>

      {/* Conversations */}
      {/* <div className="overflow-y-auto h-full pb-24"> */}
      {/* <div className="absolute inset-0 overflow-y-auto pb-6"> */}
      {/* <div className="flex-1 overflow-y-auto pb-24"> */}
      <div className="flex-1 overflow-y-auto pb-6">
        {conversations.map((conv) => {
          const otherUser = conv.participants.find(
            (p) => p._id !== loggedInUser?._id,
          );

          return (
            <div
              key={conv._id}
              onClick={() => {
                navigate(`/chat/${otherUser?._id}`);
                onClose();
              }}
              className="flex gap-3 p-4 border-b border-white/5"
            >
              <img
                src={otherUser?.profileImage || "/avatar1.jpg"}
                className="w-10 h-10 rounded-full"
              />

              <div className="flex-1">
                <div className="flex justify-between">
                  <span>{otherUser?.username}</span>

                  {conv.unreadCount > 0 && (
                    <span className="bg-red-500 text-xs px-2 rounded-full">
                      {conv.unreadCount}
                    </span>
                  )}
                </div>

                <p className="text-xs text-white/60 truncate">
                  {conv.lastMessage?.text || "No Message"}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MobileChatDrawer;
