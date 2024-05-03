import { useEffect } from "react";
import {
  COMPILER_SUPPORTED_LANGUAGES_API,
  LANGUAGE_SUPPORT,
} from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addLanguageVersion } from "../utils/appSlice";

const useGetSupportedLanguages = () => {
  const dispatch = useDispatch();
  const languageVersion = useSelector(
    (store) => store.appSlice.languageVersion
  );
  const fetchLanguages = async () => {
    const data = await fetch(COMPILER_SUPPORTED_LANGUAGES_API);
    const json = await data.json();
    let languagesAndVersions = {};
    json.forEach((language) => {
      if (LANGUAGE_SUPPORT.includes(language?.language)) {
        if (language?.language === "c++") language.language = "cpp";
        languagesAndVersions[language.language] = language.version;
      }
    });
    // console.log(languagesAndVersions);
    dispatch(addLanguageVersion(languagesAndVersions));
  };

  useEffect(() => {
    !languageVersion && fetchLanguages();
  }, []);
};
export default useGetSupportedLanguages;
