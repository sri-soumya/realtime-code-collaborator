import { Editor } from "@monaco-editor/react";
import React, { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addInput, addOutput, addShowLoader } from "../utils/appSlice";
import fetchCodeOutput from "../utils/fetchCodeOutput";
import OutputText from "./OutputText";

const InputAndOutput = () => {
  const editorRef = useRef(null);
  const dispatch = useDispatch();
  const code = useSelector((store) => store.appSlice.code);
  const input = useSelector((store) => store.appSlice.input);
  const language = useSelector((store) => store.appSlice.selectedLanguage);
  const languageVersion = useSelector(
    (store) => store.appSlice.languageVersion
  );

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
  }

  const handleRunClick = () => {};

  return (
    <div className="ml-4 mr-2 mt-4 w-[23%]">
      <button
        onClick={async () => {
          dispatch(addShowLoader(true));
          dispatch(
            addOutput(
              await fetchCodeOutput(code, input, language, languageVersion)
            )
          );
          dispatch(addShowLoader(false));
        }}
        className="bg-white py-2 px-1 rounded-md w-2/5 ml-auto mb-4 hover:bg-black hover:text-white"
      >
        Run
      </button>

      <h2 className="text-white font-semibold font-lg mb-4">Input</h2>
      <Editor
        loading
        theme="vs-dark"
        height="31vh"
        language="plaintext"
        onMount={handleEditorDidMount}
        onChange={() => {
          dispatch(addInput(editorRef?.current?.getValue()));
        }}
      />
      <h2 className="text-white font-semibold font-lg my-4">Output</h2>
      <div className="w-[100%] bg-[#1e1e1e] h-[38%] overflow-scroll">
        <OutputText />
      </div>
    </div>
  );
};

export default InputAndOutput;
