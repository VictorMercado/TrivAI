"use client";

import { SessionProvider } from "@trivai/auth/react";
import StoreInitializer from "@src/components/StoreInitializer";
import { UserState } from "@trivai/lib/server/queries/user";
import { useEffect, useRef } from "react";
import { useLocalStorage } from "@src/hooks/useLocalStorage";

type Action =
  | "offline user"
  | "remove user"
  | "reconnect"
  | "new user"
  | "new message"
  | "subscribe"
  | "unsubscribe";

type User = {
  id: string;
  userName: string;
  status: "online" | "away" | "offline";
};

type Message = {
  action: Action;
  topic: string;
  data?: string;
  user: User;
  type: string;
};

export function ClientAppWrapper({
  children,
  session,
  user,
}: {
  children: React.ReactNode;
  session: any;
  user?: UserState | undefined;
}) {
  const [color, setColor] = useLocalStorage("--color-primary", "");
  // const socket = useStore((state) => state.socket);
  let socket = useRef<WebSocket>();
  let userName = useRef<string | undefined>();
  const randNum = useRef<number>(Math.floor(Math.random() * 1000));
  useEffect(() => {
    if (session) {
      userName.current = session?.user?.userName;
      const randUser = "anon" + randNum.current;
      // Connect to the WebSocket server
      try {
        if(process.env.WS_URL !== undefined) {
          socket.current = new WebSocket(
            `${process.env.WS_URL}?userName=${userName.current || randUser}`,
          );

          socket.current.onopen = () => {
            console.log("WebSocket Client Connected");
            const msg: Message = {
              action: "new user",
              type: "subscribe",
              topic: "chat",
              user: {
                userName: userName.current || randUser,
                status: "online",
                id: session?.user?.id || randUser,
              },
            };
            socket.current?.send(JSON.stringify(msg));
          };
        } else {
          console.log("No WS_URL found");
        }
      } catch (e) {
        console.log(e);
      }
    }
    document.documentElement.style.setProperty("--color-primary", color);
    return () => {
      if (socket.current) {
        socket.current.close();
      }
    };
  }, [color]);
  return (
    <SessionProvider session={session}>
      {user ? <StoreInitializer user={user} /> : ""}
      {/* <div data-main="Main Client Div" className="">{children}</div> */}
      {children}
    </SessionProvider>
  );
}
