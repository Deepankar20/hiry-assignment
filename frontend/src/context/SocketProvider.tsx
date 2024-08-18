import React, { useCallback, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { jwtDecode, JwtPayload } from "jwt-decode";
import axios from "axios";

interface jwtType extends JwtPayload {
  email?: string;
}
interface SocketProviderProps {
  children?: React.ReactNode;
}

interface User {
  username: string;
  email: string;
  createdAt: string;
  id: number;
}

interface Imsg {
  from: User;
  to: User;
  content: string;
  timestamp: string;
}

interface Ityping {
  isTyping: boolean;
  to: User;
}

interface ISocketContext {
  sendMessage: (msg: Imsg) => any;
  typing: (data: Ityping) => any;
  messages: any;
  isTyping: boolean | undefined;
}

const SocketContext = React.createContext<ISocketContext | null>(null);

export const useSocket = () => {
  const state = useContext(SocketContext);
  if (!state) throw new Error("state is undefined");

  return state;
};

async function sendMessageToDB(msg: Imsg) {
  try {
    const res = await axios
      .post("http://localhost:3000/api/chats/addChat", msg)
      .then((data) => {
        console.log(data);
      });
  } catch (error) {}
}

const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket>();
  const [messages, setMessages] = useState<Imsg[]>([]);
  const [isTyping, setTyping] = useState<boolean>(false);

  console.log("messages are : ", messages);

  const sendMessage: ISocketContext["sendMessage"] = useCallback(
    (msg) => {
      if (socket) {
        const { from, to, content, timestamp } = msg;

        setMessages((prev) => [...prev, { from, to, content, timestamp }]);
        socket.emit("event:message", JSON.stringify(msg));
        sendMessageToDB(msg);
      }
    },
    [socket]
  );

  const typing: ISocketContext["typing"] = useCallback(
    (data: Ityping) => {
      if (socket) {
        socket.emit("event:typing", data);
      }
    },
    [socket]
  );

  const onTypingBack = useCallback(
    (isTyping: boolean) => {
      console.log("Provider", isTyping);

      setTyping(isTyping);
      setTimeout(() => {
        setTyping(false);
      }, 1000);
    },
    [socket]
  );

  const onMessageReply = useCallback((msg: string) => {
    const { from, to, content } = JSON.parse(msg);
    setMessages((prev) => [
      ...prev,
      { from, to, content, timestamp: new Date().toISOString() },
    ]);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token") ?? "";
    if (!token) {
      return;
    }
    const email: jwtType = jwtDecode(token);

    const _socket = io("http://localhost:8000", {
      query: {
        userEmail: email.email,
      },
    });

    _socket.on("event:message:reply", onMessageReply);
    _socket.on("event:typing:back", onTypingBack);

    setSocket((prev) => _socket);

    return () => {
      _socket.off("event:message:reply", onMessageReply);
      _socket.disconnect();
      setSocket(undefined);
    };
  }, []);

  return (
    <SocketContext.Provider value={{ sendMessage, messages, typing, isTyping }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
