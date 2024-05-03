import React from "react";
import Avatar from "react-avatar";

const Client = ({ user }) => {
  return (
    <div className="h-[100px] mx-2 my-2 text-center ">
      <Avatar name={user.username} size={50} round="14px" />
      <p className="text-white overflow-clip w-14 h-14">{user.username}</p>
    </div>
  );
};

export default Client;
