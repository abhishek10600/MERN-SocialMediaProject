import ChatBar from "../components/General/ChatBar";
import Navbar from "../components/General/Navbar";
import Sidebar from "../components/General/Sidebar";
import UserProfileContainer from "../components/ProfilePageComponents/UserProfileContainer";

const ProfilePage = () => {
  return (
    <div className="h-screen overflow-hidden flex flex-col">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <UserProfileContainer />
        <ChatBar />
      </div>
    </div>
  );
};

export default ProfilePage;
