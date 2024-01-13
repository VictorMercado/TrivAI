"use client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverClose,
} from "@ui/popover";
import { ProfilePicture } from "./ui/profile-picture";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "@ui/button";
import { profileRoutes } from "@src/config/site.tsx";

type ProfilePicturePopoverProps = {
  image: string;
};

const ProfilePicturePopover = ({ image }: ProfilePicturePopoverProps) => {
  const { data: session } = useSession();
  const role = session?.user.role;

  return (
    <Popover>
      <PopoverTrigger>
        <ProfilePicture image={image} />
      </PopoverTrigger>

      <PopoverContent>
        <div className="flex w-full flex-col items-center gap-y-4 ">
          <span className="text-textBase">
            {session?.user?.name?.toUpperCase() || "Not a User?"}
          </span>
          {role === "ADMIN" && (
            <PopoverClose className="w-64" asChild>
              <Link href="/admin">
                <button className="coolBorder flex w-full items-center justify-center text-sm">
                  <span className="coolText">ADMIN</span>
                </button>
              </Link>
            </PopoverClose>
          )}
          {session ? (
            <>
              {profileRoutes.map((route, index) => {
                const userName = session.user.userName;

                const hrefRoute =
                  route.route === "/profile"
                    ? `/profile/${userName}`
                    : route.route;
                return (
                  <PopoverClose key={index} className="w-64" asChild>
                    <Link
                      className={`flex items-center justify-center text-black`}
                      href={hrefRoute}
                    >
                      <Button
                        variant="default"
                        size="default"
                        className="w-full gap-x-2"
                        tabIndex={-1}
                      >
                        {route.icon}
                        {route.name}
                      </Button>
                    </Link>
                  </PopoverClose>
                );
              })}
              <button
                className="coolBorder flex w-full items-center justify-center p-2 text-sm"
                onClick={() => {
                  signOut({ callbackUrl: `/` });
                }}
              >
                {" "}
                <b className="coolText">SIGN OUT</b>
              </button>
            </>
          ) : (
            <PopoverClose className="" asChild>
              <button
                className="coolBorder flex w-full items-center justify-center p-2 text-sm"
                onClick={() => {
                  signIn();
                }}
              >
                {" "}
                <span className="coolText"> SIGN IN </span>
              </button>
            </PopoverClose>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export { ProfilePicturePopover };
