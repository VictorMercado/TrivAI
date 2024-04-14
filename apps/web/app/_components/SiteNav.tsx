"use client";
import Link from "next/link";
import { Button } from "@ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@ui/hover-card";
import { cn } from "@src/utils";
import { Suspense } from "react";
import { siteRoutes } from "@src/config/site.tsx";
import { usePathname } from "next/navigation";

type SiteNavProps = {
  className?: string;
};

const SiteNav = ({ className } : SiteNavProps) => {
  const pathname = usePathname();
  const firstLevelPath = "/" + pathname?.split("/")[1];
  
  return (
    <div
      className={cn("flex md:flex-col ", className)}
    >
      {
        siteRoutes.map((route, index) => {
          return (
            <HoverCard
              key={index}
              defaultOpen={false}
              openDelay={200}
              closeDelay={200}
            >
              <HoverCardTrigger asChild>
                <Link
                  className={`flex items-center justify-center p-2 text-black`}
                  href={route.route}
                >
                  <Button
                    variant="default"
                    size="default"
                    active={firstLevelPath === route.route}
                    // shadow-[0px_0px_7px_1px_rgb(var(--color-primary))]
                    className="w-full"
                    tabIndex={-1}
                  >
                    <Suspense fallback={route.icon}></Suspense>
                    {route.icon}
                  </Button>
                </Link>
              </HoverCardTrigger>
              <HoverCardContent className="rounded-none">
                {route.name}
              </HoverCardContent>
            </HoverCard>
          );
        })
      }
    </div>
  );
}

export { SiteNav };