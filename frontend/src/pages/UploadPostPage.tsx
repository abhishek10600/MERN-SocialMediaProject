import Navbar from "../components/General/Navbar";
import Sidebar from "../components/General/Sidebar";
import ChatBar from "../components/General/ChatBar";
import UploadPostContainer from "../components/UploadPostPageComponents/UploadPostContainer";
import AppLayout from "../components/Layout/AppLayout";

const UploadPostPage = () => {
  return (
    <AppLayout>
      <UploadPostContainer />
    </AppLayout>
  );
};

export default UploadPostPage;
