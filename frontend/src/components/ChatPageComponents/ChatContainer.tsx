import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import type { Message } from "../../types/chat";
import {
  getMessages,
  getOrCreateConversation,
  sendMessage,
  markSeen,
} from "../../api/chat.api";
import Spinner from "../General/Spinner";
import { Image as ImageIcon, X } from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { toast } from "react-toastify";
import { getSocket } from "../../socket";

const ChatContainer = () => {
  const { receiverId } = useParams<{ receiverId: string }>();
  console.log({ receiverId });

  const loggedInUser = useSelector((state: RootState) => state.auth.user);

  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [sendMessageLoading, setSendMessageLoading] = useState<boolean>(false);

  const bottomRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const initChat = async () => {
      if (!receiverId) return;

      try {
        setLoading(true);
        const conv = await getOrCreateConversation(receiverId);
        console.log({ conv });
        setConversationId(conv._id);

        const msgs = await getMessages(conv._id);
        setMessages(msgs.reverse());

        await markSeen(conv._id);
      } catch (error) {
        console.error("Failed to fetch chat", error);
      } finally {
        setLoading(false);
      }
    };

    initChat();
  }, [receiverId]);

  useEffect(() => {
    if (!conversationId) {
      return;
    }

    const socket = getSocket();
    if (!socket) {
      return;
    }
    socket.emit("join_conversation", conversationId);

    const handleNewMessage = async (msg: Message) => {
      setMessages((prev) => {
        if (prev.some((m) => m._id === msg._id)) return prev;
        return [...prev, msg];
      });

      if (msg.sender._id !== loggedInUser?._id) {
        await markSeen(conversationId);
      }
    };

    socket.on("new_message", handleNewMessage);

    return () => {
      socket.off("new_message", handleNewMessage);
      socket.emit("leave_conversation", conversationId);
    };
  }, [conversationId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handlePickImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSend = async () => {
    if (!conversationId) {
      toast.error("Chat is still loading. Please wait...");
      return;
    }
    if (!conversationId || (!text.trim() && !imageFile)) {
      return;
    }
    try {
      setSendMessageLoading(true);
      const formData = new FormData();
      formData.append("conversationId", conversationId);

      if (text.trim()) {
        formData.append("text", text);
      }
      if (imageFile) {
        formData.append("image", imageFile);
      }

      const msg = await sendMessage(formData);

      setText("");
      removeImage();
    } catch (error: any) {
      console.log(error);
      toast.error(error.message || "Failed to send message");
    } finally {
      setSendMessageLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4 text-white">
        <Spinner />
        Loading chat...
      </div>
    );
  }

  return (
    // <div className="flex flex-col h-full">
    <div className="flex flex-col h-full min-h-0">
      {/* Messages */}
      {/* <div className="flex-1 overflow-y-auto p-4 space-y-3"> */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => {
          const isMe = msg.sender._id === loggedInUser?._id;

          return (
            <div
              key={msg._id}
              className={`flex items-end gap-2 ${
                isMe ? "justify-end" : "justify-start"
              }`}
            >
              {!isMe && (
                <img
                  src={msg.sender.profileImage || "/avatar1.jpg"}
                  alt={msg.sender.username}
                  className="w-8 h-8 rounded-full object-cover"
                />
              )}

              <div
                className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm break-words ${
                  isMe
                    ? "bg-[#9929EA] text-white rounded-br-none"
                    : "bg-white/10 text-white rounded-bl-none"
                }`}
              >
                {!isMe && (
                  <p className="text-xs opacity-60 mb-1">
                    @{msg.sender.username}
                  </p>
                )}

                {msg.text && <p>{msg.text}</p>}

                {msg.image && (
                  <img src={msg.image} className="mt-2 rounded-lg max-w-full" />
                )}

                <p className="text-[10px] opacity-50 text-right mt-1">
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          );
        })}

        <div ref={bottomRef} />
      </div>

      {/* Image Preview */}
      {imagePreview && (
        <div className="px-4 pb-2">
          <div className="relative inline-block">
            <img
              src={imagePreview}
              className="w-32 h-32 object-cover rounded-lg border border-white/20"
            />
            <button
              onClick={removeImage}
              className="absolute -top-2 -right-2 bg-black rounded-full p-1"
            >
              <X size={16} className="text-white" />
            </button>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-white/10 flex gap-2 items-center mb-10 md:mb-0">
        <input
          type="file"
          accept="image/*"
          hidden
          ref={fileInputRef}
          onChange={handlePickImage}
        />

        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer"
        >
          <ImageIcon size={18} />
        </button>

        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          className="flex-1 bg-black border border-white/20 rounded px-3 py-2 text-white"
          placeholder="Type a message..."
        />

        <button
          disabled={
            !conversationId ||
            (!text.trim() && !imageFile) ||
            sendMessageLoading
          }
          onClick={handleSend}
          className="px-4 py-2 rounded-xl text-sm font-semibold transition disabled:opacity-50 hover:scale-[1.02] bg-[#9929EA] text-white cursor-pointer flex justify-center items-center"
        >
          {sendMessageLoading ? <Spinner /> : "Send"}
        </button>
      </div>
    </div>
  );
};

export default ChatContainer;
