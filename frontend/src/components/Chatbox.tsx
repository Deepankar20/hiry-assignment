import { useEffect, useRef, useState } from "react";
import { useSocket } from "../context/SocketProvider";
import { jwtDecode } from "jwt-decode";
import jwt from "jsonwebtoken";
import { useRecoilState, useRecoilValue } from "recoil";
import { receiver } from "../atom/receiver";
import Topbar from "./Topbar";
import axios from "axios";
import SendImage from "./SendImage";

interface Imsg {
  from: User;
  to: User;
  content: string;
  timestamp: string;
}

interface IPastMsg {
  receiverId: number;
  senderId: number;
  id: number;
  message?: string;
  createdAt: string;
  imageURL?: string;
}

interface User {
  username: string;
  email: string;
  createdAt: string;
  id: number;
}

export default function ChatBox() {
  const token = localStorage.getItem("token");
  const receiverUser = useRecoilValue(receiver);

  const [content, setContent] = useState("");
  const [value, setValue] = useState("");
  const [pastChats, setPastChats] = useState([]);

  const inputRef = useRef();

  let sender: User;
  if (token) {
    sender = jwtDecode(token);
  }

  const { messages, sendMessage, typing } = useSocket();

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = (e: any) => {
    e.preventDefault();

    content &&
      sendMessage({
        from: sender,
        to: receiverUser,
        content,
        timestamp: new Date().toISOString(),
      });

    setValue("");
    setContent("");
    scrollToBottom();
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getPastMessages = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/chats/getChats",
        {
          //@ts-ignore
          user1: sender,
          user2: receiverUser,
        }
      );

      const pastMessages = response.data;

      setPastChats(pastMessages.chats);
    } catch (error) {}
  };

  useEffect(() => {
    getPastMessages();
  }, [receiverUser]);

  return (
    <div className="flex flex-col h-screen">
      <Topbar />

      <div className="flex-1 flex flex-col overflow-y-auto p-4 gap-2">
        {/* Chat messages will go here */}
        {pastChats &&
          pastChats.map((message: IPastMsg) => {
            if (message.message) {
              return (
                ((message.receiverId === receiverUser.id &&
                  message.senderId === sender.id) ||
                  (message.receiverId === sender.id &&
                    message.senderId === receiverUser.id)) && (
                  <div
                    className={`max-w-lg w-fit  ${
                      message.senderId === sender.id
                        ? "self-end bg-orange-500 text-white"
                        : "bg-slate-100"
                    } py-1 px-4 rounded-lg break-words`}
                  >
                    {message.message}
                  </div>
                )
              );
            } else if (message.imageURL) {
              return (
                ((message.receiverId === receiverUser.id &&
                  message.senderId === sender.id) ||
                  (message.receiverId === sender.id &&
                    message.senderId === receiverUser.id)) && (
                  <img
                    src={message.imageURL}
                    className={`max-w-lg w-fit  ${
                      message.senderId === sender.id
                        ? "self-end bg-orange-500 text-white"
                        : "bg-slate-100"
                    } py-1 px-4 rounded-lg break-words`}
                    alt=""
                  />
                )
              );
            }
          })}
        {messages.map((message: Imsg) => {
          return (
            ((message.to.email === receiverUser.email &&
              message.from.email === sender.email) ||
              (message.to.email === sender.email &&
                message.from.email === receiverUser.email)) && (
              <div
                className={`max-w-lg w-fit  ${
                  message.from.email === sender.email
                    ? "self-end bg-orange-500 text-white"
                    : "bg-slate-100"
                } py-1 px-4 rounded-lg break-words`}
              >
                {message.content}
              </div>
            )
          );
        })}

        {/* Add more messages */}
        <div ref={messagesEndRef} />
      </div>
      <form
        onSubmit={handleSend}
        className="flex justify-between items-center p-4 gap-4 border-t border-gray-300"
      >
        <input
          value={value}
          type="text"
          placeholder="Type a message..."
          className="flex-1 p-2 border-l border-t border-b rounded-md rounded-r-none"
          onChange={(e) => {
            setContent(e.target.value);
            setValue(e.target.value);
            typing({ isTyping: true, to: receiverUser });
          }}
        />
        <div className="border-t border-b py-1">
          <SendImage />
        </div>
        <button className=" text-white px-4 py-2 rounded-md border-t border-r border-b rounded-l-none">
          <svg
            fill="#f86230"
            height="30px"
            width="40px"
            version="1.1"
            id="Layer_1"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 512.00 512.00"
            xmlSpace="preserve"
            transform="matrix(1, 0, 0, 1, 0, 0)"
            stroke="#f86230"
            strokeWidth="0.00512"
          >
            <g id="iconCarrier">
              <g>
                <path d="M483.927,212.664L66.967,25.834C30.95,9.695-7.905,42.023,1.398,80.368l21.593,89.001c3.063,12.622,11.283,23.562,22.554,30.014l83.685,47.915c6.723,3.85,6.738,13.546,0,17.405l-83.684,47.915c-11.271,6.452-19.491,17.393-22.554,30.015l-21.594,89c-9.283,38.257,29.506,70.691,65.569,54.534l416.961-186.83C521.383,282.554,521.333,229.424,483.927,212.664z M359.268,273.093l-147.519,66.1c-9.44,4.228-20.521,0.009-24.752-9.435c-4.231-9.44-0.006-20.523,9.434-24.752l109.37-49.006l-109.37-49.006c-9.44-4.231-13.665-15.313-9.434-24.752c4.229-9.44,15.309-13.666,24.752-9.435l147.519,66.101C373.996,245.505,374.007,266.49,359.268,273.093z"></path>
              </g>
            </g>
          </svg>
        </button>
      </form>
    </div>
  );
}
