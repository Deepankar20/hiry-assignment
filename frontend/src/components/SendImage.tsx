import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useRef, useState } from "react";
import { useRecoilValue } from "recoil";
import { receiver } from "../atom/receiver";

export default function SendImage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File>();
  const [url, setUrl] = useState("");
  const token = localStorage.getItem("token");

  const sender = jwtDecode(token as string);

  const receiverUser = useRecoilValue(receiver);

  const handleFileSend = async () => {
    try {
        
        const data = await axios.get("http://localhost:3000/api/aws/getURL", {
          params: {
            filename: file?.name,
            contentType: file?.type,
          },
        });
        setUrl(data.data.url);
    } catch (error) {
        console.log("error is : ",error);
        
    }

    console.log("url : ", url);

    if (url) {
      const response = await axios.put(url, file);

      const res = await axios.post(
        "http://localhost:3000/api/chats/sendImage",
        {
          from: sender,
          to: receiverUser,
          imageURL: `https://d9bskl3ph7fg2.cloudfront.net/${file?.name}`,
        }
      );
    }
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setFile(file);

      handleFileSend();
    }
  };
  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }} // Hide the file input
        onChange={handleFileChange}
        accept="image/*" // Accept only images
      />
      <button onClick={handleButtonClick}>
        <svg
          height="32px"
          width="40px"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          viewBox="0 0 280.067 280.067"
          fill="#000000"
        >
          <g id="iconCarrier">
            <path
              style={{ fill: "#f56600" }}
              d="M149.823,257.142c-31.398,30.698-81.882,30.576-113.105-0.429c-31.214-30.987-31.337-81.129-0.42-112.308l-0.026-0.018L149.841,31.615l14.203-14.098c23.522-23.356,61.65-23.356,85.172,0s23.522,61.221,0,84.586l-125.19,123.02l-0.044-0.035c-15.428,14.771-40.018,14.666-55.262-0.394c-15.244-15.069-15.34-39.361-0.394-54.588l-0.044-0.053l13.94-13.756l69.701-68.843l13.931,13.774l-83.632,82.599c-7.701,7.596-7.701,19.926,0,27.53s20.188,7.604,27.88,0L235.02,87.987l-0.035-0.026l0.473-0.403c15.682-15.568,15.682-40.823,0-56.39s-41.094-15.568-56.776,0l-0.42,0.473l-0.026-0.018l-14.194,14.089L50.466,158.485c-23.522,23.356-23.522,61.221,0,84.577s61.659,23.356,85.163,0l99.375-98.675l14.194-14.089l14.194,14.089l-14.194,14.098l-99.357,98.675C149.841,257.159,149.823,257.142,149.823,257.142z"
            />
          </g>
        </svg>
      </button>
    </div>
  );
}
