import React from "react";
import Client from "./Client";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { Navigate, useNavigate } from "react-router-dom";
import { setAllToDefault } from "../utils/appSlice";

const ConnectedUsers = () => {
  const connectedUsers = useSelector((store) => store.appSlice.connectedUsers);
  const roomId = useSelector((store) => store.appSlice.roomId);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleCopyButtonClick = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success("Room ID copied to clipboard!");
    } catch {
      toast.error("Could not copy Room ID to clipboard");
    }
  };

  const handleLeaveButtonClick = () => {
    dispatch(setAllToDefault());
    navigate("/");
  };

  return (
    <div className="h-screen flex flex-col w-[10%] ">
      <div className="h-[100%]">
        <h2 className="font-semibold text-white py-4 text-2xl ml-4">
          Connected
        </h2>
        <div className="h-[70%]">
          <div className="overflow-scroll h-[100%] flex flex-wrap justify-start grow-0 content-start">
            {connectedUsers.map((user) => {
              return <Client key={user.socketId} user={user}></Client>;
            })}
          </div>
        </div>
        <div className="mt-12 flex flex-col">
          <button
            className="bg-white py-2 px-1 rounded-md w-4/5 ml-4 mb-4 hover:bg-black hover:text-white"
            onClick={handleCopyButtonClick}
          >
            Copy Room ID
          </button>
          <button
            className="bg-[#4aed88] py-2 px-1 rounded-md w-4/5 ml-4 mb-4 hover:bg-[#2b824c]"
            onClick={handleLeaveButtonClick}
          >
            Leave Room
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConnectedUsers;
