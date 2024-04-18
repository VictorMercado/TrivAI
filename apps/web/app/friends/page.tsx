import { FriendRequest } from "@components/FriendRequest";
import { serverRouter } from "@/app/_trpc/serverRouter";
import { getCurrentUser } from "@trivai/auth/lib/getCurrentUser";
import { Friends } from "@components/Friends"; 

export default async function FriendsPage() {
  const user = await getCurrentUser();
  const router = await serverRouter();
  const pendingFriends = await router.authViewer.friend.getPending();
  const requestedFriends = await router.authViewer.friend.getRequested();

  return (
    <main className="flex size-full flex-col p-2">
      <div className="flex w-full justify-center">
        <FriendRequest userId={user!.id}/>
      </div>
      <div>
        <h1 className="text-2xl">Pending Friends</h1>
        <div className="flex w-full flex-col space-y-4 p-2">
          <Friends friends={pendingFriends} sessionUserId={user!.id} pendingRequest/>
        </div>
      </div>
      <div>
        <h1 className="text-2xl">Requested Friends</h1>
        <div className="flex w-full flex-col space-y-4 p-2">
          <Friends friends={requestedFriends} sessionUserId={user!.id} requestedRequest/>
        </div>
      </div>
      <div>
        <h1 className="text-2xl">Recommended Friends</h1>
        <div className="border border-primary/50 bg-primary/25 py-6 text-center">Coming Soon...</div>
      </div>
    </main>
  );
}