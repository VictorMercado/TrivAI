"use client";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@ui/card";
import { SquareUserRound } from "@ui/SVG";
import { Button } from "@ui/button";
import { trpc } from "@t/client";
import { useToast } from "@ui/toast";
import { useSession } from "@trivai/auth/react";
import { useStore } from "@src/store";

type ProfilePicture = {
  id: number;
  name: string;
  gen: number;
  shiny: boolean;
  mega: boolean;
  legendary: boolean;
  createdAt: Date;
  cost: number;
  image: string;
};

type ProfilePictureCardProps = {
  product: ProfilePicture;
  isBuy: boolean;
};

const ProfilePictureCard = ({
  product,
  isBuy = false,
}: ProfilePictureCardProps) => {
  const { addToast } = useToast();
  const identifier = `Gen ${product.gen} Pokemon`;
  const { decrementCredits } = useStore();
  const { data: session } = useSession();
  const utils = trpc.useUtils();
  const buy = trpc.authViewer.profilePicture.buy.useMutation({
    onSuccess: () => {
      utils.authViewer.user.getProfilePictures.invalidate();
      decrementCredits(product.cost);
      addToast({
        id: Math.floor(Math.random() * 100),
        message: "Profile Picture purchased",
        type: "success",
      });
    },
    onError: (error) => {
      addToast({
        id: Math.floor(Math.random() * 100),
        message: error.message,
        type: "error",
      });
    },
  });
  const handleBuy = (userId: string, profilePictureId: number) => {
    buy.mutate({ userId, profilePictureId });
  };

  return (
    <Card className="relative flex h-full flex-col justify-between rounded-none border border-primary bg-background text-textBase">
      <CardHeader className="p-x-2 p-y-4 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-lg">{product.name}</CardTitle>
        <SquareUserRound
          size={24}
          className="absolute right-2 top-2 text-primary"
        />
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-4">
        <Image
          unoptimized
          src={product.image}
          alt={product.name}
          width={100}
          height={100}
        />
        <div className="w-full">
          <div className="flex justify-between">
            <p>{identifier}</p>
            <p className="text-primary">{product.cost.toFixed(2)} credits</p>
          </div>
        </div>
      </CardContent>
      {isBuy ? (
        <CardFooter>
          <Button
            variant="default"
            size="default"
            className="w-full"
            onClick={() => {
              if (session?.user.id) {
                handleBuy(session.user.id, product.id);
              } else {
                addToast({
                  id: Math.floor(Math.random() * 100),
                  message: "You must be logged in to buy",
                  type: "error",
                });
              }
            }}
          >
            Buy
          </Button>
        </CardFooter>
      ) : null}
    </Card>
  );
};

export { ProfilePictureCard };
