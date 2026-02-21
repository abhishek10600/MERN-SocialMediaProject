import ChatBar from "../components/General/ChatBar";
import Navbar from "../components/General/Navbar";
import Sidebar from "../components/General/Sidebar";
import AppLayout from "../components/Layout/AppLayout";
import UserProfileContainer from "../components/ProfilePageComponents/UserProfileContainer";

const ProfilePage = () => {
  return (
    // <div className="h-screen overflow-hidden bg-black">
    //   {/* Fixed Navbar */}
    //   <Navbar />

    //   {/* Main Layout */}
    //   <div className="flex h-[calc(100vh-10vh)] overflow-hidden">
    //     <Sidebar />

    //     {/* Scrollable Center */}
    //     <div className="flex-1 overflow-y-auto">
    //       <UserProfileContainer />
    //     </div>

    //     <ChatBar />
    //   </div>
    // </div>

    <AppLayout>
      <UserProfileContainer />
    </AppLayout>
  );
};

export default ProfilePage;
