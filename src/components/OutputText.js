import React from "react";
import { useSelector } from "react-redux";
import parseEscapeCharacters from "../utils/parseEscapeCharacters";
import { parse } from "uuid";

const OutputText = () => {
  const output = useSelector((store) => store.appSlice.output);
  if (!output?.run) return;
  let text = output?.compile?.output
    ? output?.compile?.output
    : "Compiled successfully\n\n" + output?.run?.output + "\n";

  // console.log(text, parseEscapeCharacters(text));
  return (
    <div
      className="text-white text-sm p-2"
      dangerouslySetInnerHTML={{ __html: parseEscapeCharacters(text) }}
    ></div>
  );
};

export default OutputText;
