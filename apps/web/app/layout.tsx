import "./globals.css";
import { Roboto } from "next/font/google";
import { ClientAppWrapper } from "./ClientAppWrapper";
import { getSession } from "@trivai/auth/lib/getSession";
import { Analytics } from "@vercel/analytics/react";
import { Metadata } from "next";
import { Nav } from "@components/Nav";
import { Toaster } from "@ui/toast";
import { getUser } from "@trivai/lib/server/queries/user";
import localFont from "next/font/local";
import { ClientDimensions } from "@components/ClientDimensions";
import { SiteNav } from "./_components/SiteNav";
import TRPCProvider from "./_trpc/TRPCProvider";
import { cookies } from "next/headers";
import { SetCookie } from "./_components/SetCookie";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@ui/hover-card";
import { Button } from "@ui/button";
import { Settings } from "lucide-react";
import Link from "next/link";
// Font files can be colocated inside of `app`
const overseer = localFont({
  src: "../public/fonts/overseer/Overseer.otf",
  display: "swap",
});
const shareTechMono = localFont({
  src: "../public/fonts/Share_Tech_Mono/ShareTechMono-Regular.ttf",
  display: "swap",
});

export const metadata: Metadata = {
  title: "TrivAI",
  description:
    "A trivia website based on stable diffusion image generation," +
    " is an online platform that challenges users to guess what abstract" +
    " and distorted images represent, using a process called stable diffusion." +
    " It can be a fun and engaging way for people to test their observation skills" +
    " and improve their cognitive abilities.",
};

interface IProps {
  children: React.ReactNode;
}
const roboto = Roboto({
  weight: ["500", "700"],
  subsets: ["latin"],
  display: "swap",
});

export default async function RootLayout({ children }: IProps) {
  const session = await getSession();
  let dbUser;
  if (session) {
    dbUser = await getUser();
  }
  const cookieStore = cookies();
  const cookie = cookieStore.get("userToken");
  
  return (
    <html
      className={
        shareTechMono.className +
        " coolBackground flex min-h-screen text-sm font-light md:text-base"
      }
      lang="en"
    >
      {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />
      <body
        className="flex w-screen grow flex-col"
        data-atr="this is the body"
      >
        <TRPCProvider>
          {!cookie && session ? <SetCookie /> : null}
          <ClientAppWrapper
            session={session}
            //TODO Check if this is the best way to do this
            // strictly selecting the data we need from the dbUser object and avoiding the functions because they are not serializable
            user={dbUser}
          >
            {/* <ClientDimensions /> */}
            <Nav />
            <div className="flex grow flex-col justify-between md:flex-row md:justify-start">
              <div className="fixed bottom-0 left-0 z-50 order-last flex w-screen justify-center border-r border-primary/25 bg-background pb-5 md:static md:order-first md:w-24 md:items-start">
                <div className="flex h-full flex-col">
                  <SiteNav />
                </div>
              </div>
              <div className="flex h-full w-full flex-col">{children}</div>
              <div className="h-32 lg:h-2"></div>
            </div>
            <div className="fixed left-4 bottom-16 hidden md:block z-50">
              <HoverCard>
                <HoverCardTrigger className="h-min" asChild>
                  <Link
                    href="/settings"
                    className=" items-center justify-center p-2 text-black"
                  >
                    <Button variant="default" size="default">
                      <Settings className="h-6 w-6" />
                    </Button>
                  </Link>
                </HoverCardTrigger>
                <HoverCardContent>Settings</HoverCardContent>
              </HoverCard>
            </div>
          </ClientAppWrapper>
        </TRPCProvider>

        {/* temporary fix to add spacing so pages dont get covered by bottom nav on mobile */}
        <Toaster />
        <Analytics />
      </body>
    </html>
  );
}
