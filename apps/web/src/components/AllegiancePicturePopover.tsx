"use client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverClose,
} from "@ui/popover";
import { ProfilePicture } from "./ui/profile-picture";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRef } from "react";
import Link from "next/link";
import { Button } from "@ui/button";
import { profileRoutes } from "@src/config/site.tsx";

type AllegiancePicturePopoverProps = {
  image: string;
  route: string;
  name?: string;
  size?: number;
};

const AllegiancePicturePopover = ({
  image,
  route,
  name,
  size,
}: AllegiancePicturePopoverProps) => {
  const popoverRef = useRef<HTMLDivElement>(null);
  return (
    <Popover>
      <PopoverTrigger>
        <ProfilePicture image={image} size={size} />
      </PopoverTrigger>

      <PopoverContent ref={popoverRef} className="w-42">
        <div className="flex w-full flex-col items-center gap-y-4 ">
          <h1 className="text-md">{name}</h1>
          <PopoverClose asChild>
            <Link href={route}>
              <Button
                variant="default"
                size="default"
                className="w-full"
                tabIndex={-1}
              >
                <p className="">visit</p>
              </Button>
            </Link>
          </PopoverClose>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export { AllegiancePicturePopover };
