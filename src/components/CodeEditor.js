import React, { useEffect, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import "react-dropdown/style.css";
import Select from "react-select";
import useGetSupportedLanguages from "../hooks/useGetSupportedLanguages";
import { LANGUAGE_SUPPORT_OPTIONS } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addCode, addSelectedLanguage } from "../utils/appSlice";
import ACTIONS, { CODE_CHANGE } from "../action";

const CodeEditor = ({ socketRef, onCodeChange, onSelectedLanguageChange }) => {
  const editorRef = useRef(null);
  const dispatch = useDispatch();
  const code = useSelector((store) => store.appSlice.code);
  const roomId = useSelector((store) => store.appSlice.roomId);
  const [selectedOption, setSelectedOption] = useState(
    LANGUAGE_SUPPORT_OPTIONS[0]
  );
  const lang = useSelector((store) => store.appSlice.selectedLanguage);
  onSelectedLanguageChange(selectedOption);
  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
  }

  const handleEditorOnChange = () => {
    onCodeChange(editorRef.current.getValue());
    dispatch(addCode({ code: editorRef.current.getValue(), type: "edited" }));
    if (!socketRef?.current) return;
    socketRef.current.emit(ACTIONS.CODE_CHANGE, {
      roomId,
      code: editorRef.current.getValue(),
    });
    return () => {
      socketRef.current.off(ACTIONS.CODE_CHANGE);
    };
  };

  const handleOptionChange = (newSelectedOption) => {
    // console.log(selectedOption);
    dispatch(addSelectedLanguage(newSelectedOption));
    onSelectedLanguageChange(newSelectedOption);
    setSelectedOption(newSelectedOption);
    if (!socketRef?.current) return;
    // console.log(newSelectedOption);
    socketRef.current.emit(ACTIONS.LANGUAGE_CHANGE, {
      roomId,
      language: newSelectedOption,
    });
  };

  useEffect(() => {
    setSelectedOption(lang);
    // console.log("lagg", lang);
  }, [lang]);

  useEffect(() => {
    dispatch(addSelectedLanguage(selectedOption));
  }, [selectedOption]);

  useEffect(() => {
    if (!socketRef?.current) return;

    socketRef.current.on(ACTIONS.CODE_CHANGE, (code) => {
      // console.log(code.code);
      dispatch(addCode({ code: code.code, type: "shared" }));
      onCodeChange(code.code);
    });

    return () => {
      socketRef.current.off(ACTIONS.CODE_CHANGE);
    };
  }, [socketRef.current]);

  function showValue() {
    alert(editorRef?.current?.getValue());
  }
  // console.log(selectedOption);
  return (
    <div className="w-[60%] mx-8">
      <Select
        onChange={handleOptionChange}
        options={LANGUAGE_SUPPORT_OPTIONS}
        className="w-[20%] mt-4"
        value={selectedOption}
      />

      <Editor
        className="mt-8"
        loading
        value={code?.code}
        theme="vs-dark"
        height="80vh"
        language={selectedOption?.value}
        onMount={handleEditorDidMount}
        onChange={handleEditorOnChange}
      />
    </div>
  );
};
export default CodeEditor;
