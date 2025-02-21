import { UserRound } from "lucide-react";
import { Avatar } from "../../../components/ui/avatar";
import { Illustration } from "../../../components/Global/Illustration";
import { Skeleton } from "../../../components/ui/skeleton";

import { useGetProfileInfo } from "../api/use-get-profileInfo";
import { formatFollowersCount } from "@/lib/utils";
import useGetUsername from "@/hooks/use-get-username";


const ProfileCard = () => {
  
  const username = useGetUsername();

  const { data: userData, isLoading, error } = useGetProfileInfo(username);

  if(error) {
    return (
      <div className="relative overflow-hidden rounded-xl bg-zinc-900 px-6 py-8 sm:px-12 sm:py-10 shadow-lg dark:border dark:border-zinc-700 min-w-[350px]">
              <Illustration className="absolute left-0 top-0 -translate-x-1/2" aria-hidden="true" />
              <Illustration className="absolute bottom-0 right-0 translate-x-1/4" aria-hidden="true" />
              <div className="flex flex-col items-center justify-between gap-6 lg:flex-row lg:gap-10">
              <h1 className="text-2xl font-semibold text-foreground text-center p-5">
                Cannot fetch user data
              </h1>
              </div>
            </div>
    )
  }


    if (isLoading) {
        return (
            <div className="relative overflow-hidden rounded-xl bg-zinc-900 px-6 py-8 sm:px-12 sm:py-10 shadow-lg dark:border dark:border-zinc-700 min-w-[350px]">
              <Illustration className="absolute left-0 top-0 -translate-x-1/2" aria-hidden="true" />
              <Illustration className="absolute bottom-0 right-0 translate-x-1/4" aria-hidden="true" />
              <div className="flex flex-col items-center justify-between gap-6 lg:flex-row lg:gap-10">
                <div className="flex flex-col items-center lg:items-start gap-4 lg:gap-6">
                  <Avatar>
                  <UserRound size={48} strokeWidth={2} className="opacity-60" aria-hidden="true" />
                  </Avatar>
                  <div className="flex flex-col items-center justify-center text-center lg:text-left">
                    <Skeleton className="w-32 h-6 mb-2" />
                    <Skeleton className="w-24 h-4" />
                  </div>
                </div>
        
                <div className="flex flex-wrap justify-center gap-4">
                  <div className="flex flex-col items-center rounded-md bg-zinc-800 px-4 py-2 text-sm text-foreground">
                    <Skeleton className="w-12 h-4 mb-2" />
                    <Skeleton className="w-8 h-6" />
                  </div>
                  <div className="flex flex-col items-center rounded-md bg-zinc-800 px-4 py-2 text-sm text-foreground">
                    <Skeleton className="w-12 h-4 mb-2" />
                    <Skeleton className="w-8 h-6" />
                  </div>
                  <div className="flex flex-col items-center rounded-md bg-zinc-800 px-4 py-2 text-sm text-foreground">
                    <Skeleton className="w-12 h-4 mb-2" />
                    <Skeleton className="w-8 h-6" />
                  </div>
                </div>
              </div>
            </div>
          );
    }

  return (
    <div className="relative overflow-hidden rounded-xl bg-zinc-900 px-6 py-8 sm:px-12 sm:py-10 shadow-lg dark:border dark:border-zinc-700 min-w-[350px]">
      <Illustration className="absolute left-0 top-0 -translate-x-1/2" aria-hidden="true" />
      <Illustration className="absolute bottom-0 right-0 translate-x-1/4" aria-hidden="true" />
      <div className="flex flex-col items-center justify-between gap-6 lg:flex-row lg:gap-10">
        <div className="flex flex-col items-center lg:items-start gap-4 lg:gap-6">
          <Avatar>
              <UserRound size={48} strokeWidth={2} className="opacity-60" aria-hidden="true" />
          </Avatar>
          <div className="text-center lg:text-left">
            <h2 className="text-2xl font-semibold text-foreground">{userData?.full_name}</h2>
            <p className="text-sm text-zinc-400">@{userData?.username}</p>
          </div>
        </div>

        <div className="flex flex-wrap justify-center lg:justify-start gap-4">
          <div className="flex flex-col items-center rounded-md bg-zinc-800 px-4 py-2 text-sm text-foreground">
            <h3 className="font-medium">Posts</h3>
            <p className="text-lg font-semibold">{userData?.post}</p>
          </div>
          <div className="flex flex-col items-center rounded-md bg-zinc-800 px-4 py-2 text-sm text-foreground">
            <h3 className="font-medium">Followers</h3>
            <p className="text-lg font-semibold">{formatFollowersCount(userData?.followers)}</p>
          </div>
          <div className="flex flex-col items-center rounded-md bg-zinc-800 px-4 py-2 text-sm text-foreground">
            <h3 className="font-medium">Following</h3>
            <p className="text-lg font-semibold">{formatFollowersCount(userData?.following)}</p>
          </div>
        </div>
      </div>
    </div>
  ); 
};

export default ProfileCard;
