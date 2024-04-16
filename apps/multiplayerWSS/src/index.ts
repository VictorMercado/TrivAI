import figlet from "figlet";
import Bun from "bun"; // Import the Bun module

const arrayOfMessages = [
  "anon: Hello, World!",
  "anon: Welcome to the Bun WebSocket server!",
  "anon: This is a message from the server",
  "anon: This is another message from the server",
  "anon: This is a third message from the server",
  "anon: This is a fourth message from the server",
  "anon: This is a fifth message from the server",
  "anon: This is a sixth message from the server",
  "anon: This is a seventh message from the server",
  "anon: This is a eighth message from the server",
  "anon: This is a ninth message from the server",
  "anon: This is a tenth message from the server",
  "anon: This is a eleventh message from the server",
  "anon: This is a twelfth message from the server",
];

type User = {
  id: string;
  status: "online" | "away" | "offline";
  userName: string;
  // socket: Bun.ServerWebSocket<WebSocketData>;
};

const arrayOfUsers : Array<User> = [];

type Action = "offline user" | "remove user" | "new user" | "new message" | "subscribe" | "unsubscribe" | "reconnect";

type Message = {
  action: Action;
  topic: string;
  data?: string[];
  user: User;
  type: string;
};

type WebSocketData = {
  userName: string;
};

const server = Bun.serve({
  port: process.env.PORT || 3002,
  fetch(req, server) {
    const url = new URL(req.url);
    let res = new Response("Hello World");
    res.headers.set('Access-Control-Allow-Origin', '*');
    res.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    console.log("cookie: " + req.headers.getSetCookie());
    
    if (url.pathname === "/chat") {
      const upgraded = server.upgrade<WebSocketData>(req, {
        data: {
          userName: new URL(req.url).searchParams.get("userName") as string,
        },
      });
      if (!upgraded) {
        return new Response("Upgrade failed", { status: 400 });
      }
      return;
    }
    return res;
  },
  websocket: {
    publishToSelf: true,
    open(ws) {
      ws.subscribe("chat");
      // handle WebSocket connection open event
      console.log("WebSocket connection opened");
      // console.log(ws.remoteAddress);
      let msgObject = {
        type: "message",
        action: "new message",
        topic: "chat",
        data: arrayOfMessages,
      }
      ws.send(JSON.stringify(msgObject));
      let userObject = {
        type: "message",
        action: "new user",
        topic: "chat",
        data: arrayOfUsers,
      }
      ws.send(JSON.stringify(userObject));
      // let id = setInterval(() => {
      //   ws.send("Welcome to the Bun WebSocket server!");
      // } , 1000);
    },
    message(ws, message) {
      // handle WebSocket message event
      console.log("Received message:", message);
      // let msg = "this is a message from the server";
      // ws.send(figlet.textSync(msg)); // echo back the message
      let resObject = JSON.parse(message as string);
      if (resObject.topic == "chat") {
        if (resObject.action == "new user") {
          let user = resObject.user;
          let userExists = false;
          arrayOfUsers.map((user) => {
            if (user.userName == resObject.user.userName) {
              userExists = true;
            }
          });
          if (userExists == false) {
            arrayOfUsers.push(user);
            let newMessage = `${user.userName} has joined the chat!`;
            let sendObject : Message;
            if (arrayOfMessages.indexOf(newMessage) == -1) {
              arrayOfMessages.push(newMessage);
              sendObject = {
                topic: "chat",
                type: "message",
                action: "new message",
                user: user,
                data: [newMessage],
              };
              ws.publish("chat", JSON.stringify(sendObject));
            }
            let userObject = {
              topic: "chat",
              type: "messagee",
              action: "new user",
              user: user,
              data: arrayOfUsers,
            };
            ws.publish("chat", JSON.stringify(userObject));
          } else {
            let userObject = {
              topic: "chat",
              type: "message",
              action: "reconnect",
              user: user,
              data: [{
                userName: user.userName,
                status: "online",
              }],
            };
            ws.publish("chat", JSON.stringify(userObject));
          }

        } 
        else if (resObject.action == "new message") {
          let user = resObject.user;
          let newMessage = `${user.userName}: ${resObject.data}`;
          arrayOfMessages.push(newMessage);
          arrayOfUsers.map((user) => {
            if (user.userName == resObject.user.userName) {
              user.status = "online";
            }
          });
          let sendObject : Message = {
            topic: "chat",
            type: "message",
            user: user,
            action: "new message",
            data: [newMessage],
          };
          ws.publish("chat", JSON.stringify(sendObject));
        }
        else if (resObject.action == "unsubscribe") {
          console.log("unsubscribing");
          console.log(resObject.user);
        }
        // let user = resObject.user;
        // let newMessage = `${user}: ${resObject.data}`;
        // arrayOfMessages.push(newMessage);
        // let sendObject = {
        //   topic: "chat",
        //   type: "message",
        //   order: "append",
        //   data: [newMessage],
        // };
      }

      // ws.send(JSON.stringify(sendObject));
      // ws.publish("chat", JSON.stringify(sendObject));
    },
    close(ws : Bun.ServerWebSocket<WebSocketData>) {
      // handle WebSocket connection close event

      // const removedUser = arrayOfUsers.splice(arrayOfUsers.indexOf(ws.data.userName), 1)[0];
      // console.log(removedUser);
      // console.log(arrayOfUsers);
      let userName = ws.data.userName;
      let sendObject = {
        type: "message",
        action: "offline user",
        topic: "chat",
        data: [{
          userName: userName,
          status: "offline",
        }],
      }
      // ws.publishText("chat", JSON.stringify(sendObject));
      try {
        ws.publish("chat", JSON.stringify(sendObject));
        console.log("published");
      }
      catch (error) {
        console.log(error);
      }
      arrayOfUsers.map((user) => {
        if (user.userName == userName) {
          user.status = "away";
        }
      });
      console.log(ws.data.userName + " has left the chat!");
      console.log("WebSocket connection closed");
      ws.unsubscribe("chat");
    },

    drain(ws) {
      // handle WebSocket drain event
      console.log("WebSocket drain event");
    },
  },
});

console.log(`Listening on http://localhost:${server.port} ...`);