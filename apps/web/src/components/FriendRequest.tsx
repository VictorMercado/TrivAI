"use client";
import { Input } from "@ui/input";
import { Button } from "@ui/button";
import { useState } from "react";
import { useToast } from "@ui/toast";
import { trpc } from "@t/client";

type FriendRequestProps = {
  userId: string;
};

const FriendRequest = ({userId} : FriendRequestProps) => {
  const utils = trpc.useUtils();
  const [username, setUsername] = useState("");
  const { addToast } = useToast();
  const createFriend = trpc.authViewer.friend.create.useMutation({
    onSuccess: () => {
      setUsername("");
      addToast({
        id: Math.random(),
        message: "Friend request sent",
        type: "success",
      });
      utils.authViewer.friend.getRequested.invalidate();
    },
    onError: (e) => {
      addToast({
        id: Math.random(),
        message: e.message,
        type: "error",
      });
    }
  });

  const handleSendRequest = (userId: string, friendUsername: string) => {
    createFriend.mutate({ userId, friendUsername });
  };

  return (
    <div className="flex flex-col p-2">
      <h1 className="text-2xl">Add friend</h1>
      <form className="flex p-2" onSubmit={(e) => {
          e.preventDefault();
        }
      }>
        <Input
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            console.log(e.target.value);
          }}
          className="h-full w-64"
        />
        <Button variant="default" size="default" onClick={() => handleSendRequest(userId, username)}>Send request</Button>
      </form>
    </div>
  );
}

export { FriendRequest };