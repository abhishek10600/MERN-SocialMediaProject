import Navbar from "../components/General/Navbar";
import Sidebar from "../components/General/Sidebar";
import ChatBar from "../components/General/ChatBar";
import ChatContainer from "../components/ChatPageComponents/ChatContainer";
import AppLayout from "../components/Layout/AppLayout";

const ChatPage = () => {
  return (
    // <div className="h-screen overflow-hidden bg-black">
    //   {/* Fixed Navbar */}
    //   <Navbar />

    //   {/* Main Layout */}
    //   <div className="flex h-[calc(100vh-10vh)] overflow-hidden">
    //     <Sidebar />

    //     {/* Scrollable Center */}
    //     <div className="flex-1 overflow-y-auto">
    //       <ChatContainer />
    //     </div>

    //     <ChatBar />
    //   </div>
    // </div>
    <AppLayout variant="full">
      <ChatContainer />
    </AppLayout>
  );
};

export default ChatPage;
