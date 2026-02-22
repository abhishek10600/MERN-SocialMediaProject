import { useEffect, useState } from "react";
import UserInfo from "./UserInfo";
import type { userProfileInfoType } from "../../types/userprofile";
import {
  getUserProfileInfo,
  getUserProfilePosts,
} from "../../api/userProfile.api";
import { Link, useParams } from "react-router-dom";
import Spinner from "../General/Spinner";
import UserPosts from "./UserPosts";
import type { UserPostType } from "../../types/userPost";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { Upload, UploadIcon } from "lucide-react";

const UserProfileContainer = () => {
  const { username } = useParams<{ username: string }>();
  const loggedInUser = useSelector((state: RootState) => state.auth.user);

  const [userProfileInfo, setUserProfileInfo] =
    useState<userProfileInfoType | null>(null);
  const [loading, setLoading] = useState(true);

  const [postLoading, setPostLoading] = useState(true);
  const [userPosts, setUserPosts] = useState<UserPostType[]>([]);

  const refetchProfile = async () => {
    if (!username) {
      return;
    }
    try {
      const userProfileInfo = await getUserProfileInfo(username);
      setUserProfileInfo(userProfileInfo);
    } catch (error) {
      console.log("Failed to fetch profile: ", error);
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await refetchProfile();
      setLoading(false);
    };
    init();
  }, [username]);

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

  const handleDeletePostFromUI = (postId: string) => {
    setUserPosts((prev) => prev.filter((post) => post._id !== postId));
    refetchProfile();
  };

  if (loading) return <Spinner />;

  if (!userProfileInfo) {
    return <div className="text-white p-6">User not found</div>;
  }

  return (
    // <div className="max-w-225 mx-auto w-full flex flex-col">
    <div className="w-full max-w-4xl mx-auto flex flex-col overflow-x-hidden">
      <UserInfo user={userProfileInfo} refetchProfile={refetchProfile} />
      {loggedInUser?.username === username && (
        <div className="flex justify-end px-8">
          <Link
            to="/upload-post"
            className="px-4 py-2 rounded-xl text-sm font-semibold transition disabled:opacity-50 cursor-pointer hover:scale-[1.02] bg-[#9929EA] text-white flex justify-center items-center gap-1"
          >
            <UploadIcon size={18} />
            Upload
          </Link>
        </div>
      )}
      {postLoading ? (
        <Spinner />
      ) : (
        <UserPosts
          userPosts={userPosts}
          onDeletePost={handleDeletePostFromUI}
        />
      )}
    </div>
  );
};

export default UserProfileContainer;
