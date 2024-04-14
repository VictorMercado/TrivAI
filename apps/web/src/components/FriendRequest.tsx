"use client";
import { Input } from "@ui/input";
import { Button } from "@ui/button";
import { useState } from "react";
import { useToast } from "@ui/toast";
import { trpc } from "@t/client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const FriendRequest = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [username, setUsername] = useState("");
  const toast = useToast();
  const { mutate } = trpc.authViewer.friend.create.useMutation({
    onSuccess: () => {
      setUsername("");
    },
    onError: () => {
      toast.addToast({
        id: Math.random(),
        message: "Error sending friend request",
        type: "error",
      });
    }
  });

  const handleSendRequest = async () => {
    try {
      mutate({ userId: session!.user.id, friendUsername: username });
      toast.addToast({
        id: Math.random(),
        message: "Friend request sent",
        type: "success",
      });
      router.push("/friends");
      router.refresh();
    } catch (error) {
      toast.addToast({
        id: Math.random(),
        message: "Error sending friend request",
        type: "error",
      });
    }
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
        <Button variant="default" size="default" onClick={handleSendRequest}>Send request</Button>
      </form>
    </div>
  );
}

export { FriendRequest };