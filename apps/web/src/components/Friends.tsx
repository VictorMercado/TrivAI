"use client";
import { trpc } from "@t/client";
import { Friend } from "@trivai/trpc/server/routers/AuthViewer/friend/getAll.schema";
import Link from "next/link";
import { User } from "./User";
import { FriendRequestOptions } from "./FriendRequestOptions";

type FriendsProps = {
  friends: Array<Friend>;
  sessionUserId: string;
  pendingRequest?: boolean;
  requestedRequest?: boolean;
};

const Friends = ({
  friends,
  sessionUserId,
  pendingRequest,
  requestedRequest,
}: FriendsProps) => {
  const pendingFriends = trpc.authViewer.friend.getPending.useQuery(undefined, {
    initialData: friends,
  });
  const requestedFriends = trpc.authViewer.friend.getRequested.useQuery(undefined, {
    initialData: friends,
  });
  const allFriends = trpc.authViewer.friend.getAll.useQuery(undefined, {
    initialData: friends,
  });
  return (
    <>
      {pendingRequest
        ? pendingFriends.data.map((friend) => {
            return (
              <div className="flex justify-between" key={friend.id}>
                <div className="flex">
                  <User
                    id={friend.id}
                    name={friend.name}
                    userName={friend.userName}
                    image={friend.image}
                    prize={friend.prize}
                    totalScore={friend.totalScore}
                    credits={friend.credits}
                    sessionUserId={sessionUserId}
                  />
                </div>
                <div className="flex items-center justify-center">
                  <FriendRequestOptions
                    friendId={friend.id}
                    userId={sessionUserId}
                    pendingRequest
                  />
                </div>
              </div>
            );
          })
        : requestedRequest
          ? requestedFriends.data.map((friend) => {
              return (
                <div className="flex justify-between" key={friend.id}>
                  <div className="flex">
                    <User
                      id={friend.id}
                      name={friend.name}
                      userName={friend.userName}
                      image={friend.image}
                      prize={friend.prize}
                      totalScore={friend.totalScore}
                      credits={friend.credits}
                      sessionUserId={sessionUserId}
                    />
                  </div>
                  <div className="flex items-center justify-center space-x-4">
                    <FriendRequestOptions
                      friendId={friend.id}
                      userId={sessionUserId}
                      requestedRequest
                    />
                  </div>
                </div>
              );
            })
          : allFriends.data.map((friend) => (
              <Link
                href={`/friends/${friend.userName}`}
                key={friend.id}
                className="w-full min-w-72"
              >
                <User
                  id={friend.id}
                  name={friend.name || "No name"}
                  userName={friend.userName || "Ghost"}
                  image={friend.image || "/default.png"}
                  prize={friend.prize || "N/a"}
                  totalScore={friend.totalScore}
                  credits={friend.credits}
                  sessionUserId={sessionUserId}
                />
              </Link>
            ))}
    </>
  );
};

export { Friends };
