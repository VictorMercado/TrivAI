import { Box } from "./_components/box";
import { TabSwitcher } from "@ui/tab-switcher";
import Image from "next/image";
import { Button } from "@ui/button";
import { prisma } from "@trivai/prisma";
import { serverRouter } from "@/app/_trpc/serverRouter";
import { Suspense } from "react";
import { Store } from "./Store";


export default async function StorePage() {
  const router = await serverRouter();
  // const profilePictures = await router.authViewer.profilePicture.getMore({ take: 10, skip: 0 });
  return (
    <div className="flex w-full flex-col items-center space-y-4">
      <Store  />
    </div>
  );
}
