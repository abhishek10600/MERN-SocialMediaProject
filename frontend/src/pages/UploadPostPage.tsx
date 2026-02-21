import Navbar from "../components/General/Navbar";
import Sidebar from "../components/General/Sidebar";
import ChatBar from "../components/General/ChatBar";
import UploadPostContainer from "../components/UploadPostPageComponents/UploadPostContainer";
import AppLayout from "../components/Layout/AppLayout";

const UploadPostPage = () => {
  return (
    // <div className="h-screen overflow-hidden bg-black">
    //   {/* Fixed Navbar */}
    //   <Navbar />

    //   {/* Main Layout */}
    //   <div className="flex h-[calc(100vh-10vh)] overflow-hidden">
    //     <Sidebar />

    //     {/* Scrollable Center */}
    //     <div className="flex-1 overflow-y-auto">
    //       <UploadPostContainer />
    //     </div>

    //     <ChatBar />
    //   </div>
    // </div>

    <AppLayout>
      <UploadPostContainer />
    </AppLayout>
  );
};

export default UploadPostPage;
