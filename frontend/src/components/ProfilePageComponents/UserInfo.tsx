import { useEffect, useRef, useState } from "react";
import type { userProfileInfoType } from "../../types/userprofile";
import { toast } from "react-toastify";
import {
  followUser,
  unfollowUser,
  updateProfileImage,
} from "../../api/userProfile.api";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import Spinner from "../General/Spinner";
import { addBio, updateBio } from "../../api/userProfile.api";
import { Pencil, Check, X, User2 } from "lucide-react";

interface UserInfoProps {
  user: userProfileInfoType;
  refetchProfile?: () => void;
}

const UserInfo = ({ user, refetchProfile }: UserInfoProps) => {
  const loggedInUser = useSelector((state: RootState) => state.auth.user);
  const [isFollowing, setIsFollowing] = useState(user.isFollowing);
  const [followersCount, setFollowersCount] = useState<number>(
    user.followersCount,
  );
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [isEditingBio, setIsEditingBio] = useState<boolean>(false);
  const [bioInput, setBioInput] = useState(user.bio || "");
  const [bioLoading, setBioLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const isOwnProfile = loggedInUser?.username === user.username;

  useEffect(() => {
    setBioInput(user.bio || "");
  }, [user.bio]);

  const handleSaveBio = async () => {
    if (!bioInput.trim()) {
      toast.error("Bio cannot be empty");
      return;
    }
    try {
      setBioLoading(true);
      if (!user.bio) {
        await addBio(bioInput.trim());
        toast.success("Bio added successfully");
      } else {
        await updateBio(bioInput.trim());
        toast.success("Bio updated successfully");
      }
      setIsEditingBio(false);
      refetchProfile?.();
    } catch (error: any) {
      toast.error(error.message || "Failed to save bio");
    } finally {
      setBioLoading(false);
    }
  };

  useEffect(() => {
    setIsFollowing(user.isFollowing);
    setFollowersCount(user.followersCount);
  }, [user]);

  const handleFollowToggle = async () => {
    if (loading) {
      return;
    }
    const prevIsFollowing = isFollowing;
    const prevFollowersCount = followersCount;
    try {
      setLoading(true);
      if (isFollowing) {
        setIsFollowing(false);
        setFollowersCount((prev) => prev - 1);
        await unfollowUser(user.username);
      } else {
        setIsFollowing(true);
        setFollowersCount((prev) => prev + 1);
        await followUser(user.username);
        toast.success(`You started following ${user.username}`);
      }
    } catch (error: any) {
      setIsFollowing(prevIsFollowing);
      setFollowersCount(prevFollowersCount);
      toast.error(`${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handlePickImage = () => {
    fileInputRef.current?.click();
  };

  const handleProfileImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }
    const formData = new FormData();
    formData.append("profileImage", file);
    try {
      setImageUploading(true);
      await updateProfileImage(formData);
      toast.success("Profile image updated successfully");
      refetchProfile?.();
    } catch (error: any) {
      toast.error(error.message || "Failed to update the profile image");
    } finally {
      setImageUploading(false);
    }
  };

  return (
    <div className="w-full rounded-3xl p-8">
      {/* Top Row: Avatar + Actions */}
      <div className="flex items-center justify-between">
        {/* Avatar */}
        <div className="relative">
          <div className="w-24 h-24 rounded-full p-0.5 bg-linear-to-br from-violet-500 via-fuchsia-500 to-cyan-400 shadow-[0_0_35px_rgba(168,85,247,0.45)]">
            <div className="w-full h-full rounded-full overflow-hidden bg-black">
              {user.profileImage ? (
                <img
                  src={user.profileImage || "/defaultavatar.png"}
                  alt={user.username}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="z-10">
                  <User2 />
                </div>
              )}
            </div>
          </div>
          {isOwnProfile && (
            <button
              onClick={handlePickImage}
              disabled={imageUploading}
              title="Change profile picture"
              className="absolute bottom-0 right-0 rounded-full bg-black/70 p-2 border border-white/20 hover:bg-black transition disabled:opacity-50 cursor-pointer"
            >
              {imageUploading ? (
                <Spinner />
              ) : (
                <Pencil size={14} className="text-white" />
              )}
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={handleProfileImageChange}
            className=""
          />
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {!isOwnProfile && (
            <button
              disabled={loading}
              onClick={handleFollowToggle}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition disabled:opacity-50 cursor-pointer hover:scale-[1.02] ${
                isFollowing
                  ? "border border-white/20 text-white hover:bg-white/10"
                  : "bg-[#9929EA] text-white"
              }`}
            >
              {isFollowing ? "Unfollow" : "Follow"}
            </button>
          )}

          {!isOwnProfile && (
            <button className="px-4 py-2 rounded-xl text-sm font-semibold border border-white/15 text-white hover:bg-white/10 transition">
              Message
            </button>
          )}
        </div>
      </div>

      {/* User Info */}
      <div className="mt-4">
        <h1 className="text-2xl font-bold text-white tracking-tight">
          @{user.username}
        </h1>
        <p className="text-sm text-zinc-400">{user.email}</p>
      </div>

      {/* Bio */}
      {/* {user?.bio ? (
        <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs uppercase tracking-widest text-zinc-400 mb-1">
            Bio
          </p>

          <p className="text-sm text-zinc-200 leading-relaxed">
            {user.bio?.trim()}
          </p>
        </div>
      ) : (
        <></>
      )} */}
      <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4 relative">
        <div className="flex items-center justify-between mb-1">
          <p className="text-xs uppercase tracking-widest text-zinc-400">Bio</p>

          {isOwnProfile && !isEditingBio && (
            <button
              onClick={() => setIsEditingBio(true)}
              className="text-zinc-400 hover:text-white transition"
            >
              <Pencil size={14} />
            </button>
          )}
        </div>

        {/* View Mode */}
        {!isEditingBio && user.bio && (
          <p className="text-sm text-zinc-200 leading-relaxed">
            {user.bio.trim()}
          </p>
        )}

        {/* Empty State */}
        {!isEditingBio && !user.bio && isOwnProfile && (
          <button
            onClick={() => setIsEditingBio(true)}
            className="text-sm text-violet-400 hover:underline"
          >
            + Add bio
          </button>
        )}

        {/* Edit Mode */}
        {isEditingBio && (
          <div className="space-y-2">
            <textarea
              value={bioInput}
              onChange={(e) => setBioInput(e.target.value)}
              placeholder="Write something about yourself..."
              rows={3}
              className="w-full rounded-lg bg-black/40 border border-white/10 p-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-violet-500 resize-none"
            />

            <div className="flex gap-2">
              <button
                onClick={handleSaveBio}
                disabled={bioLoading}
                className="px-3 py-1.5 rounded-lg bg-violet-600 text-white text-sm hover:bg-violet-700 transition disabled:opacity-50 cursor-pointer"
              >
                {bioLoading ? <Spinner /> : "Save"}
              </button>

              <button
                onClick={() => {
                  setIsEditingBio(false);
                  setBioInput(user.bio || "");
                }}
                className="px-3 py-1.5 rounded-lg border border-white/20 text-white text-sm hover:bg-white/10 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        {[
          { label: "Posts", value: user.postCount },
          { label: "Followers", value: followersCount },
          { label: "Following", value: user.followingCount },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-4 text-center"
          >
            <p className="text-xl font-bold text-white">{stat.value}</p>
            <p className="text-[11px] uppercase tracking-widest text-zinc-400">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
      <hr className="text-white/20 mt-8" />
    </div>
  );
};

export default UserInfo;
