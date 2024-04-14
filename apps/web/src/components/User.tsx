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

type UserProps = {
  id: number;
  name: string;
  userName: string;
  image: string;
  prize: string;
  totalScore: number;
  credits: number;
};

const User = ({
  id,
  name,
  userName,
  image,
  prize,
  totalScore,
  credits,
}: UserProps) => {
  return (
    <div className="flex justify-between">
      <div className="flex">
        <Image src={image} alt={name} width={80} height={80} className="size-16 md:size-24" />
        <div className="px-2">
          <h1>{name}</h1>
          <h2 className="text-slate-500">{userName}</h2>
          <p>{totalScore}</p>
        </div>
      </div>
      <div className="flex grow items-center justify-center">
        <p>{prize}</p>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <MoreVertical />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-52 p-2">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <div className="space-y-2">
            <DropdownMenuItem asChild>
              <Button size="default" variant="default" className="w-full" onClick={(e)=> {
                e.preventDefault();
                alert("Invite to Quiz");
              }}>
                Invite to Quiz
              </Button>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Button size="default" variant="default" className="w-full" onClick={(e)=>{
                e.preventDefault();
                alert("Send Quiz");
              }}>
                Send Quiz
              </Button>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Button size="default" variant="default" className="w-full" onClick={(e)=> {
                e.preventDefault();
                alert("Invite to Allegiance");
              }}>
                Invite to Allegiance
              </Button>
            </DropdownMenuItem>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export { User };
