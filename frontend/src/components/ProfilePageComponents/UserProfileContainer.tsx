import { useEffect, useState } from "react";
import UserInfo from "./UserInfo";
import type { userProfileInfoType } from "../../types/userprofile";
import {
  getUserProfileInfo,
  getUserProfilePosts,
} from "../../api/userProfile.api";
import { useParams } from "react-router-dom";
import Spinner from "../General/Spinner";
import UserPosts from "./UserPosts";
import type { UserPostType } from "../../types/userPost";

const UserProfileContainer = () => {
  const { username } = useParams<{ username: string }>();

  const [userProfileInfo, setUserProfileInfo] =
    useState<userProfileInfoType | null>(null);
  const [loading, setLoading] = useState(true);

  const [postLoading, setPostLoading] = useState(true);
  const [userPosts, setUserPosts] = useState<UserPostType[]>([]);

  useEffect(() => {
    if (!username) return;

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

  useEffect(() => {
    if (!username) return;

    const getUserPosts = async () => {
      try {
        const response = await getUserProfilePosts(username);
        setUserPosts(response);
      } catch (error) {
        console.log("Failed to fetch posts: ", error);
      } finally {
        setPostLoading(false);
      }
    };

    getUserPosts();
  }, [username]);

  if (loading) return <Spinner />;

  if (!userProfileInfo) {
    return <div className="text-white p-6">User not found</div>;
  }

  return (
    <div className="max-w-[900px] mx-auto w-full p-6 flex flex-col gap-6">
      <UserInfo user={userProfileInfo} />
      {postLoading ? <Spinner /> : <UserPosts userPosts={userPosts} />}
    </div>
  );
};

export default UserProfileContainer;
