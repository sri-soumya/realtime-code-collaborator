import { useSelector } from "react-redux";
import axios from "axios";
const api = axios.create({
  baseURL: "https://emkc.org/api/v2/piston",
});

const fetchCodeOutput = async (code, input, language, languageVersion) => {
  const response = await api.post("/execute", {
    language: language.value,
    version: languageVersion[language.value],
    files: [
      {
        content: code?.code,
      },
    ],
    stdin: input,
  });
  // console.log(response.data);
  return response.data;
};

export default fetchCodeOutput;
