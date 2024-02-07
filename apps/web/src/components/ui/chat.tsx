"use client";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@ui/button";

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

const Chat: React.FC = () => {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<string[]>([]);
  const [message, setMessage] = useState<string>("");
  const [users, setUsers] = useState<Array<User>>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [scrollBottom, setScrollBottom] = useState<boolean>(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  let userName = useRef<string | undefined>();
  let socket = useRef<WebSocket>();
  const randNum = useRef<number>(Math.floor(Math.random() * 1000));

  useEffect(() => {
    userName.current = session?.user?.userName;
    const randUser = "anon" + randNum.current;
    // Connect to the WebSocket server
    try {
      socket.current = new WebSocket(
        `ws://localhost:3005/chat?userName=${userName.current || randUser}`,
        "chat",
      ); // Replace with your server's address
      // socket.current.
    } catch (e) {
      console.log(e);
      socket.current = new WebSocket("ws://192.168.4.53:3005", "chat"); // Replace with your server's address
    }

    // Connection opened -> Subscribe
    socket.current.onopen = () => {
      setUsers([]);
      setMessages([]);
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
    // event handler for reconnecting
    // Handle incoming messages
    socket.current.onmessage = (event: MessageEvent) => {
      console.log("");
      const newChatServerMessageJson = event.data;
      let chatServerMessage = JSON.parse(newChatServerMessageJson);
      const action: Action = chatServerMessage.action;
      if (action === "new user") {
        const newUser = chatServerMessage.data;
        setUsers((prevUsers) => [...newUser]);
      } else if (action === "reconnect") {
        const userArray = chatServerMessage.data;
        const newUser = userArray[0];
        setUsers((prevUsers) =>
          prevUsers.map((user) => {
            if (user.userName === newUser.userName) {
              return {
                ...user,
                status: "online",
              };
            }
            return user;
          }),
        );
      } else if (action === "remove user") {
        alert("remove user");
        const userArray = chatServerMessage.data;
        const removedUser = userArray[0];
        setUsers((prevUsers) => userArray);
      } else if (action === "new message") {
        setMessages((prevMessages) => [
          ...prevMessages,
          ...chatServerMessage.data,
        ]);
        setScrollBottom(true);
      } else if (action === "offline user") {
        const userArray = chatServerMessage.data;
        const offlineUser = userArray[0];
        setUsers((prevUsers) =>
          prevUsers.map((user) => {
            if (user.userName === offlineUser.userName) {
              return {
                ...user,
                status: "offline",
              };
            }
            return user;
          }),
        );
      }
    };
    // socket.current.onclose = (event: CloseEvent): any => {
    //   alert("Socket closed unexpectedly");
    //   console.log(
    //     "WebSocket closed with code:",
    //     event.code,
    //     "reason:",
    //     event.reason,
    //   );
    // };
    return () => {
      // Close the WebSocket connection when the component unmounts
      if (socket.current) {
        socket.current.close();
      }
    };
  }, []);
  useLayoutEffect(() => {
    if (scrollBottom) {
      scrollToBottom();
      setScrollBottom(false);
    }
  }, [messages, scrollBottom]);

  const sendMessage = (e: any) => {
    e.preventDefault();
    // socket.current.
    if (message.trim() !== "" && socket.current) {
      // Send the message to the server
      let sendMessageObject: Message = {
        topic: "chat",
        data: message,
        user: {
          userName: userName.current || "anon" + randNum.current,
          status: "online",
          id: session?.user?.id || "anon" + randNum.current,
        },
        type: "message",
        action: "new message",
      };
      socket.current.send(JSON.stringify(sendMessageObject));
      setMessage("");
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 md:space-x-10">
        <ol className="grid h-min grid-cols-3 justify-start md:grid-cols-5">
          {users.map((user, index) => {
            return (
              <li
                className="justify-left m-2 flex items-center truncate"
                title={user.userName}
                key={index}
              >
                {/* <div className="mr-2 h-2 w-2 rounded-lg bg-green-500"></div> */}
                <span className="relative mr-2 flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                  <span
                    className={`relative inline-flex h-3 w-3 rounded-full ${
                      user.status === "online"
                        ? "bg-green-500"
                        : user.status === "away"
                        ? "bg-yellow-500"
                        : "bg-gray-500"
                    }`}
                  ></span>
                </span>
                <p
                  className={`${
                    user.userName === userName.current
                      ? "border-b-4 border-primary"
                      : ""
                  }`}
                >
                  {user.userName}
                </p>
                {/* <div className="before:translate inline-flex before:absolute before:block before:h-2 before:w-2 before:rounded-lg before:bg-green-500"></div> */}
              </li>
            );
          })}
        </ol>
        <div className="2xl:max-h-[60rem] flex-col flex max-h-[51rem]">
          <div className="h-full overflow-auto break-words">
            <ol>
              {messages.map((msg, index) => {
                if (messages.length - 1 === index)
                  return (
                    <li key={index}>
                      <div ref={messagesEndRef} className="">
                        {msg}
                      </div>
                    </li>
                  );
                return (
                  <li key={index}>
                    <div>{msg}</div>
                  </li>
                );
              })}
            </ol>
          </div>
          <form className="mx-auto p-2">
            <input
              className="border border-primary bg-background p-2"
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
            />
            <Button
              variant="default"
              size="default"
              className="border border-primary p-2"
              onClick={(e) => sendMessage(e)}
            >
              Send
            </Button>
          </form>
        </div>
      </div>
    </>
  );
};

export { Chat };
