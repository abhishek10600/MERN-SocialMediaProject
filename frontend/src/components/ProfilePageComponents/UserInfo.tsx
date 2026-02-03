import React from "react";
import type { userProfileInfoType } from "../../types/userprofile";
import { User2 } from "lucide-react";

interface UserInfoProps {
  user: userProfileInfoType;
}

const UserInfo = ({ user }: UserInfoProps) => {
  return (
    <div className="w-full rounded-3xl p-8">
      {/* Top Row: Avatar + Actions */}
      <div className="flex items-center justify-between">
        {/* Avatar */}
        <div className="relative">
          <div className="w-24 h-24 rounded-full p-[2px] bg-gradient-to-br from-violet-500 via-fuchsia-500 to-cyan-400 shadow-[0_0_35px_rgba(168,85,247,0.45)]">
            <div className="w-full h-full rounded-full overflow-hidden bg-black">
              <img
                src={user.profileImage || "/default-avatar.png"}
                alt={user.username}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button className="px-4 py-2 rounded-xl text-sm font-semibold bg-[#9929EA] text-white cursor-pointer hover:scale-[1.02] transition">
            Follow
          </button>
          <button className="px-4 py-2 rounded-xl text-sm font-semibold border border-white/15 text-white hover:bg-white/10 transition">
            Message
          </button>
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
      {user?.bio ? (
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
      )}

      {/* Stats */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        {[
          { label: "Posts", value: user.postCount },
          { label: "Followers", value: user.followersCount },
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
    </div>
  );
};

export default UserInfo;
