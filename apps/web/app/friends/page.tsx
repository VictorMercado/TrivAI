import { SideBar } from "@components/SideBar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { Button } from "@ui/button";
import { Input } from "@ui/input";
import { FriendRequest } from "@components/FriendRequest";
import { serverRouter } from "@/app/_trpc/serverRouter";
import Image from "next/image";

export default async function FriendsPage() {
  const router = await serverRouter();
  const pendingFriends = await router.authViewer.friend.getPending();
  const requestedFriends = await router.authViewer.friend.getRequested();

  return (
    <main className="flex size-full flex-col p-2">
      <div className="flex w-full justify-center">
        <FriendRequest />
      </div>
      <div>
        <h1 className="text-2xl">Pending Friends</h1>
        <div className="flex w-full flex-col space-y-4 p-2">
          {pendingFriends.map(({ friend }) => {
            return (
              <div className="flex justify-between" key={friend.id}>
                <div className="flex">
                  <Image
                    src={friend.image || "/default.png"}
                    alt={friend.name || "friend"}
                    width={80}
                    height={80}
                    className="size-16 md:size-24"
                  />
                  <div className="px-2">
                    <h1>{friend.name}</h1>
                    <h2 className="text-slate-500">{friend.userName}</h2>
                  </div>
                </div>
                <div className="flex items-center justify-center">
                  <Button
                    size="default"
                    variant="default"
                    // onClick={() => {
                    //   router.authViewer.friend.cancel({ friendId: friend.id });
                    // }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div>
        <h1 className="text-2xl">Requested Friends</h1>
        <div className="flex w-full flex-col space-y-4 p-2">
          {requestedFriends.map(({ user }) => {
            return (
              <div className="flex justify-between" key={user.id}>
                <div className="flex">
                  <img
                    src={user.image || "/default.png"}
                    alt={user.name || "friend"}
                    width={80}
                    height={80}
                    className="size-16 md:size-24"
                  />
                  <div className="px-2">
                    <h1>{user.name}</h1>
                    <h2 className="text-slate-500">{user.userName}</h2>
                  </div>
                </div>
                <div className="flex items-center justify-center space-x-4">
                  <Button
                    size="default"
                    variant="default"
                    // onClick={() => {
                    //   router.authViewer.friend.accept({ friendId: friend.id });
                    // }}
                  >
                    Accept
                  </Button>
                  <Button
                    size="default"
                    variant="default"
                    // onClick={() => {
                    //   router.authViewer.friend.reject({ friendId: friend.id });
                    // }}
                  >
                    Reject
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div>
        <h1 className="text-2xl">Recommended Friends</h1>
        <div className="border border-primary/50 bg-primary/25 py-6 text-center">Coming Soon...</div>
      </div>
    </main>
  );
}