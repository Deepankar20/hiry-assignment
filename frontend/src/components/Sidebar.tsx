import axios from "axios";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { receiver } from "../atom/receiver";
import { jwtDecode } from "jwt-decode";

interface User {
  username: string;
  email: string;
  createdAt: string;
  id: number;
}

export default function Sidebar() {
  const [selected, setSelected] = useState("All");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [users, setUsers] = useState<User[]>([]);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [receiverUser, setReceiverUser] = useRecoilState(receiver);
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      if (searchTerm.length > 0) {
        try {
          const response = await axios
            .get(
              `http://localhost:3000/api/user/search?searchTerm=${searchTerm}`
            )
            .then((data) => {
              setUsers(data.data);
            });

          setShowDropdown(true);
        } catch (error) {
          console.error("Error fetching users:", error);
          setShowDropdown(false);
        }
      } else {
        setShowDropdown(false);
      }
    };

    fetchUsers();
  }, [searchTerm]);

  const getUsersToChat = async () => {
    const token = localStorage.getItem("token");
    const user: User = jwtDecode(token as string);
    try {
      const response = await axios
        .get(`http://localhost:3000/api/user/getUsersToChat`, {
          //@ts-ignore
          userId: user.id,
        })
        .then((data) => {
          setChats(data.data);
        });
    } catch (error) {}
  };

  useEffect(() => {
    // getUsersToChat();
  }, []);

  const handleUserClick = (user: User) => {
    // Handle user click (e.g., navigate to user profile, etc.)
    console.log("User clicked:", user);
    setShowDropdown(false);
    setReceiverUser(user);
    // Set search bar to selected user's name
  };

  const handleSelect = (e: any) => {
    setSelected(e.target.name);
  };
  return (
    <div>
      <div className="text-center p-4 border border-b-slate-200  ">
        <input
          type="text"
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search"
          className=" w-full border p-4 border-slate-500 rounded-md bg-slate-100 text-slate-800 placeholder:text-slate-900"
        />
        {showDropdown && users.length > 0 && (
          <div className="absolute z-10 w-[28.5rem] bg-white border border-gray-300 rounded ">
            {users.map((user) => (
              <div
                key={user.id}
                className="p-2 hover:bg-gray-100 cursor-pointer border border-b-slate-600"
                onClick={() => handleUserClick(user)}
              >
                <p className="text-sm font-medium">{user.username}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className=" flex gap-2 p-4 sticky">
        <button
          name="All"
          className={`border ${
            selected === "All" ? "bg-orange-500 text-white" : ""
          } border-slate-700 rounded-xl px-2 `}
          onClick={(e) => handleSelect(e)}
        >
          All
        </button>
        <button
          name="Unread"
          className={`border border-slate-700 rounded-xl px-2 ${
            selected === "Unread" ? "bg-orange-500 text-white" : ""
          }`}
          onClick={(e) => handleSelect(e)}
        >
          Unread
        </button>
        <button
          name="Archived"
          className={`border border-slate-700 rounded-xl px-2 ${
            selected === "Archived" ? "bg-orange-500 text-white" : ""
          }`}
          onClick={(e) => handleSelect(e)}
        >
          Archived
        </button>
        <button
          name="Blocked"
          className={`border  border-slate-700 rounded-xl px-2 ${
            selected === "Blocked" ? "bg-orange-500 text-white" : ""
          } `}
          onClick={(e) => handleSelect(e)}
        >
          Blocked
        </button>
      </div>

      <div>
        {chats.map((chat: User) => {
          return <div>{chat.username}</div>;
        })}
      </div>
    </div>
  );
}
