import ChatBar from "../components/General/ChatBar";
import Navbar from "../components/General/Navbar";
import Sidebar from "../components/General/Sidebar";
import AppLayout from "../components/Layout/AppLayout";
import UserProfileContainer from "../components/ProfilePageComponents/UserProfileContainer";

const ProfilePage = () => {
  return (
    <AppLayout>
      <UserProfileContainer />
    </AppLayout>
  );
};

export default ProfilePage;
