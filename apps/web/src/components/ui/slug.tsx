"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@trivai/lib/utils";
import { useSession } from "next-auth/react";

type SlugProps = {
  className?: string;
};

const Slug = ({ className }: SlugProps) => {
  const pathname = usePathname();
  const { data: session } = useSession();
  const pathnames = pathname?.split("/").slice(1);
  return (
    <>
      {pathname === "/"
        ? null
        : pathnames?.map((path, index) => {
            return (
              <div
                className={cn(
                  "flex items-center space-x-1 text-lg md:space-x-2 md:text-2xl",
                  className,
                )}
                key={index}
              >
                <span>/</span>
                {path === "profile" ? (
                  <Link href={`/profile/${session?.user?.userName}`}>
                    <h1 className="coolText">{path.toUpperCase()}</h1>
                  </Link>
                ) : index !== pathnames.length - 1 ? (
                  <Link href={`/${path}`}>
                    <h1 className="coolText">{path.toUpperCase()}</h1>
                  </Link>
                ) : (
                  <h1 className="coolText">{path.toUpperCase()}</h1>
                )}
              </div>
            );
          })}
    </>
  );
};
export { Slug };
