"use client";
import { trpc } from "@t/client";
import { Button } from "@ui/button";
import { useToast } from "@ui/toast";

type FriendRequestOptionsProps = {
  userId: string;
  friendId: string;
} & (
  | {pendingRequest: boolean; requestedRequest?: never}
  | {pendingRequest?: never; requestedRequest: boolean}
);

const FriendRequestOptions = ({ userId, friendId, pendingRequest, requestedRequest}: FriendRequestOptionsProps) => {
  // trpc.authViewer.friend.;
  const { addToast} = useToast();
  const utils = trpc.useUtils();
  const cancelRequest = trpc.authViewer.friend.cancelRequest.useMutation({
    onSuccess: () => {
      addToast({
        id: Math.random(),
        message: "Request cancelled",
        type: "success",
      });
      utils.authViewer.friend.getPending.invalidate();
    },
    onError: (error) => {
      addToast({
        id: Math.random(),
        message: "Error cancelling request",
        type: "error",
      });
    },
  });

  const acceptRequest = trpc.authViewer.friend.acceptRequest.useMutation({
    onSuccess: () => {
      addToast({
        id: Math.random(),
        message: "Request accepted",
        type: "success",
      });
      utils.authViewer.friend.getAll.invalidate();
    },
    onError: (error) => {
      addToast({
        id: Math.random(),
        message: "Error accepting request",
        type: "error",
      });
    },
  });

  const declineRequest = trpc.authViewer.friend.declineRequest.useMutation({
    onSuccess: () => {
      addToast({
        id: Math.random(),
        message: "Request declined",
        type: "success",
      });
      utils.authViewer.friend.getRequested.invalidate();
    },
    onError: (error) => {
      addToast({
        id: Math.random(),
        message: "Error declining request",
        type: "error",
      });
    },
  });

  const handleDeclineRequest = async ({userId, friendId} : {userId : string; friendId: string;}) => {
    declineRequest.mutate({userId, friendId});
  }

  const handleAcceptRequest = async ({userId, friendId} : {userId : string; friendId: string;}) => {
    acceptRequest.mutate({userId, friendId});
  }

  const handleCancelRequest = async ({userId, friendId} : {userId : string; friendId: string;}) => {
    cancelRequest.mutate({userId, friendId});
  }



  return pendingRequest ? (
    <Button
      variant="default"
      size="default"
      onClick={() => handleCancelRequest({ userId, friendId })}
    >
      Cancel Request
    </Button>
  ) : requestedRequest ? (
    <>
      <Button
        variant="default"
        size="default"
        onClick={() => handleAcceptRequest({ userId, friendId })}
      >
        Accept
      </Button>
      <Button
        variant="default"
        size="default"
        onClick={() => handleDeclineRequest({ userId, friendId })}
      >
        Decline
      </Button>
    </>
  ) : null;
};

export { FriendRequestOptions };