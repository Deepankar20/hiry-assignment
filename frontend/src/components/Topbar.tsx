import { useRecoilState, useRecoilValue } from "recoil";
import { receiver } from "../atom/receiver";
import { useSocket } from "../context/SocketProvider";

export default function Topbar() {
  const receiverUser = useRecoilValue(receiver);
  const { isTyping } = useSocket();
  console.log(isTyping);
  

  return (
    <div className="w-full bg-slate-100 h-[5.7rem]  flex flex-col p-8">
      {receiverUser.username && (
        <div>
          <div className="font-semibold text-xl">{receiverUser.username}</div>
          <div className="text-xs text-slate-500">
            {isTyping ? "typing..." : ""}
          </div>
        </div>
      )}
    </div>
  );
}
