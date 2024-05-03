import React, { useEffect, useRef, useState } from "react";
import ConnectedUsers from "./ConnectedUsers";
import CodeEditor from "./CodeEditor";
import InputAndOutput from "./InputAndOutput";
import useGetSupportedLanguages from "../hooks/useGetSupportedLanguages";
import { useDispatch, useSelector } from "react-redux";
import { ColorRing } from "react-loader-spinner";
import initSocket from "../socket";
import ACTIONS from "../action";
import toast from "react-hot-toast";
import { Navigate, useNavigate } from "react-router-dom";
import {
  addCode,
  addConnectedUsers,
  addSelectedLanguage,
  addShowLoader,
  removeConnectedUser,
} from "../utils/appSlice";

const EditorPage = () => {
  useGetSupportedLanguages();
  const showLoader = useSelector((store) => store.appSlice.showLoader);
  const socketRef = useRef(null);
  const codeRef = useRef(null);
  const selectedLanguageRef = useRef(null);
  const username = useSelector((store) => store.appSlice.username);
  const roomId = useSelector((store) => store.appSlice.roomId);
  const selectedLanguage = useSelector(
    (store) => store.appSlice.selectedLanguage
  );
  const reactNavigator = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const init = async () => {
      dispatch(addShowLoader(true));
      socketRef.current = await initSocket();
      dispatch(addShowLoader(false));
      socketRef.current.on("connect_error", (err) => handleErrors());
      socketRef.current.on("connect_failed", (err) => handleErrors());

      const handleErrors = () => {
        toast.error("Connection failed. Please try again later.");
        reactNavigator("/");
      };

      socketRef.current.emit(ACTIONS.JOIN, {
        roomId,
        username,
      });

      socketRef.current.on(
        ACTIONS.JOINED,
        ({ clients, newUsername, socketId }) => {
          if (username !== newUsername) {
            toast.success(`${newUsername} joined the room.`);
            socketRef.current.emit(ACTIONS.SYNC_CODE, {
              code: codeRef.current,
              selectedLanguage: selectedLanguageRef.current,
              socketId,
            });
          }
          dispatch(addConnectedUsers(clients));
        }
      );

      socketRef.current.on(ACTIONS.SYNC_CODE, ({ code, selectedLanguage }) => {
        // console.log(code, selectedLanguage);
        dispatch(addCode({ code, type: "shared" }));
        dispatch(addSelectedLanguage(selectedLanguage));
      });

      socketRef.current.on(ACTIONS.LANGUAGE_CHANGE, ({ language }) => {
        dispatch(addSelectedLanguage(language));
      });

      socketRef.current.on(
        ACTIONS.DISCONNECTED,
        ({ socketId, leaveUsername }) => {
          // console.log(leaveUsername, socketId);
          toast.success(`${leaveUsername} left the room`);
          dispatch(removeConnectedUser({ socketId, username: leaveUsername }));
        }
      );
    };

    if (!username || !roomId) return;
    init();

    return () => {
      socketRef.current.off(ACTIONS.JOINED);
      socketRef.current.off(ACTIONS.DISCONNECTED);
      socketRef.current.off(ACTIONS.SYNC_CODE);
      socketRef.current.off(ACTIONS.LANGUAGE_CHANGE);
      socketRef.current.disconnect();
    };
  }, []);
  if (!username || !roomId) return <Navigate to="/" />;

  return (
    <div>
      {showLoader && (
        <div>
          <div className="fixed z-20 top-[40%] left-[40%]">
            <ColorRing
              visible={true}
              height="80"
              width="80"
              ariaLabel="color-ring-loading"
              wrapperStyle={{}}
              wrapperClass="color-ring-wrapper"
              colors={["#fff", "#fff", "#fff", "#fff", "#fff"]}
            />
          </div>
        </div>
      )}
      <div className="flex">
        <ConnectedUsers />
        <CodeEditor
          socketRef={socketRef}
          onCodeChange={(code) => (codeRef.current = code)}
          onSelectedLanguageChange={(selectedLanguage) =>
            (selectedLanguageRef.current = selectedLanguage)
          }
        />
        <InputAndOutput />
      </div>
    </div>
  );
};

export default EditorPage;
