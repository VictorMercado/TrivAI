"use client";
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
import Image from "next/image";
import { trpc } from "@t/client";
import { useToast } from "@ui/toast";

type UserProps = {
  id: string;
  name: string;
  userName: string;
  image: string;
  prize: string;
  totalScore: number;
  credits: number;
  // TODO: maybe change name of this prop to friendId or rootUser 
  // to make the distinction that this is the session user interacting with the friend
  sessionUserId: string;
  actions?: boolean;
};

const User = ({
  id,
  name,
  userName,
  image,
  prize,
  totalScore,
  credits,
  sessionUserId,
  actions = false,
}: UserProps) => {
  const utils = trpc.useUtils();
  const { addToast } = useToast();
  const deleteFriend = trpc.authViewer.friend.delete.useMutation({
    onSuccess: () => {
      addToast({
        id: Math.random(),
        message: "Friend deleted",
        type: "success",
      });
      utils.authViewer.friend.getAll.invalidate();
    },
    onError: (error) => {
      addToast({
        id: Math.random(),
        message: "Error deleting friend",
        type: "error",
      });
    },
  });

  const handleDeleteFriend = (friendId : string, sessionUserId : string) => {
    deleteFriend.mutate({
      userId: sessionUserId,
      friendId,
    });
  }

  return (
    <div className="flex w-full justify-between">
      <div className="flex">
        <Image
          src={image}
          alt={name}
          width={80}
          height={80}
          className="size-16 md:size-24"
        />
        <div className="px-2">
          <h1>{name}</h1>
          <h2 className="text-slate-500">{userName}</h2>
          <p>Score: {totalScore}</p>
        </div>
      </div>
      <div className="flex hidden grow items-center justify-center">
        <p>{prize}</p>
      </div>
      {actions && (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <MoreVertical />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-52 p-2">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="space-y-2">
              <DropdownMenuItem asChild>
                <Button
                  size="default"
                  variant="default"
                  className="w-full"
                  onClick={(e) => {
                    e.preventDefault();
                    alert("Invite to Quiz");
                  }}
                >
                  Invite to Quiz
                </Button>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Button
                  size="default"
                  variant="default"
                  className="w-full"
                  onClick={(e) => {
                    e.preventDefault();
                    alert("Send Quiz");
                  }}
                >
                  Assign Quiz
                </Button>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Button
                  size="default"
                  variant="default"
                  className="w-full"
                  onClick={(e) => {
                    e.preventDefault();
                    alert("Invite to Allegiance");
                  }}
                >
                  Invite to Allegiance
                </Button>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Button
                  size="default"
                  variant="default"
                  className="w-full"
                  onClick={(e) => {
                    e.preventDefault();
                    handleDeleteFriend(id, sessionUserId);
                  }}
                >
                  Delete Friend
                </Button>
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};

export { User };
