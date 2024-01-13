import Link from "next/link";
import { Button } from "@ui/button";
import { Eye, Home, LineChart, Scroll, Settings } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@ui/hover-card";
import { cn } from "@src/utils";

import { siteRoutes } from "@src/config/site.tsx";

type SiteNavProps = {
  className?: string;
};

const SiteNav = ({ className } : SiteNavProps) => {

  return (
    <div
      className={cn("flex lg:flex-col ", className)}
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
                  className={`flex items-center justify-center p-2 text-black `}
                  href={route.route}
                >
                  <Button
                    variant="default"
                    size="default"
                    className="w-full"
                    tabIndex={-1}
                  >
                    {route.icon}
                  </Button>
                </Link>
              </HoverCardTrigger>
              <HoverCardContent
                className="rounded-none"
                >{route.name}</HoverCardContent>
            </HoverCard>
          );
        })
      }
    </div>
  );
}

export { SiteNav };