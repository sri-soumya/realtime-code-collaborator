import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addRoomId, addUsername } from "../utils/appSlice";

const Home = () => {
  const [roomId, setRoomid] = useState("");
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleCreateNewRoomId = (e) => {
    e.preventDefault();
    setRoomid(uuidv4());
    toast.success("New Room ID Created!");
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!roomId || !userName) {
      toast.error("Room ID and Name is required!");
      return;
    }
    dispatch(addUsername(userName));
    dispatch(addRoomId(roomId));
    navigate(`editor/${roomId}`);
  };

  return (
    <div className="h-screen">
      <div className="w-1/3 mx-auto pt-64 ">
        <div className="bg-[#282a36] px-8 py-8 rounded-lg flex flex-col">
          <h2 className="text-white mb-4 font-semibold">
            Realtime Code Collaborator
          </h2>
          <div className="flex flex-col">
            <input
              type="text"
              placeholder="Room ID"
              className="mb-4 py-2 px-2 rounded-md"
              value={roomId}
              onChange={(e) => setRoomid(e.target.value)}
            />
            <input
              type="text"
              placeholder="Name"
              className="mb-4 py-2 px-2 rounded-md"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
            <button
              className="bg-[#4aed88] py-2 px-1 rounded-md w-1/3 ml-auto hover:bg-[#2b824c]"
              onClick={handleFormSubmit}
            >
              Join
            </button>
            <a
              href=""
              className="mx-auto mt-3 text-[#4aed88] border-b-[1px] border-[#4aed88] hover:text-[#368654] hover:border-[#368654]"
              onClick={handleCreateNewRoomId}
            >
              Create a new room
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
