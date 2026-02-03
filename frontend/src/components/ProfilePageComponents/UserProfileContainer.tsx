import { useEffect, useState } from "react";
import UserInfo from "./UserInfo";
import type { userProfileInfoType } from "../../types/userprofile";
import { getUserProfileInfo } from "../../api/userProfile.api";
import { useParams } from "react-router-dom";
import Spinner from "../General/Spinner";

const UserProfileContainer = () => {
  const { username } = useParams<{ username: string }>();
  const [userProfileInfo, setUserProfileInfo] =
    useState<userProfileInfoType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!username) {
      return;
    }
    const getUserProfileData = async () => {
      try {
        const userProfileInfo = await getUserProfileInfo(username);
        setUserProfileInfo(userProfileInfo);
      } catch (error) {
        console.log("Failed to fetch profile: ", error);
      } finally {
        setLoading(false);
      }
    };

    getUserProfileData();
  }, [username]);

  if (loading) {
    return <Spinner />;
  }

  if (!userProfileInfo) {
    return <div className="min-w-[64vw] text-white p-6">User not found</div>;
  }

  return (
    <div className="min-w-[64vw]">
      <UserInfo user={userProfileInfo} />
    </div>
  );
};

export default UserProfileContainer;
