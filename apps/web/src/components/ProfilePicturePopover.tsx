import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverClose,
} from "@ui/popover";
import { ProfilePicture } from "./ui/profile-picture";
import Link from "next/link";
import { profileRoutes } from "@src/config/site.tsx";
import { SVGCoin } from "./ui/SVG";
import { getUserWithProperties } from "@trivai/lib/server/queries/user";
import { getCurrentUser } from "@trivai/auth/lib/getCurrentUser";
import { AuthButton } from "./ui/auth-button";
import { Button } from "@ui/button";
import { use } from "react";

type ProfilePicturePopoverProps = {
  image: string;
};

const ProfilePicturePopover = ({ image }: ProfilePicturePopoverProps) => {
  const userSession = use(getCurrentUser());
  if (!userSession) {
    return (
      <Popover>
        <PopoverTrigger>
          <ProfilePicture image={image} />
        </PopoverTrigger>

        <PopoverContent>
          <div className="flex w-full flex-col items-center gap-y-4 ">
            <div className="flex gap-x-2">
              <span className="text-textBase">
                Not a User?
              </span>
            </div>
            <PopoverClose className="" asChild>
              <AuthButton />
            </PopoverClose>
          </div>
        </PopoverContent>
      </Popover>
    );
  }
  const user = use(getUserWithProperties({
    userId: userSession.id,
    properties: ["credits", "userName", "role"],
  }));
  
  return (
    <Popover>
      <PopoverTrigger>
        <ProfilePicture image={image} />
      </PopoverTrigger>

      <PopoverContent>
        <div className="flex w-full flex-col items-center gap-y-4 ">
          <div className="flex items-center gap-x-2">
            <span className="text-textBase">
              {user?.userName?.toUpperCase()}
            </span>
            <div className="flex items-center gap-x-1 text-yellow-600 dark:text-yellow-400">
              <SVGCoin size={24} className="inline-block" />
              <span className="">{user?.credits}</span>
            </div>
          </div>
          {user?.role === "ADMIN" && (
            <PopoverClose className="w-64" asChild>
              <Link href="/admin">
                <Button className="w-full" variant="special" size="default">
                  ADMIN
                </Button>
              </Link>
            </PopoverClose>
          )}
          <>
            {profileRoutes.map((route, index) => {
              const userName = user?.userName;

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
            <AuthButton />
          </>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export { ProfilePicturePopover };
