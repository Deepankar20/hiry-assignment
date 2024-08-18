import { useRecoilValue } from "recoil";
import Chatbox from "../components/Chatbox";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { receiver } from "../atom/receiver";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function Home() {
  const receiverUser = useRecoilValue(receiver);
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, []);
  return (
    <div className="flex">
      <div className="w-1/3 border border-r-slate-200 h-screen">
        <Sidebar />
      </div>

      <div className="w-2/3 flex flex-col">
        {/* <Topbar/> */}
        {receiverUser.email && <Chatbox />}
      </div>
    </div>
  );
}
