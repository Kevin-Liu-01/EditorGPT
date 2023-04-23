/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { type NextPage } from "next";
import { useState } from "react";
// import { api } from "~/utils/api";
import { ChatIcon } from "@heroicons/react/solid";
import Navbar from "./components/navbar";
import Chat from "./components/chatgpt";
import Editor from "./components/editor";

const Home: NextPage = () => {
  const [pattern, setPattern] = useState("cross");
  const [translate, setTranslate] = useState(false);
  const [font, setFont] = useState("font-general");

  const patternBG = () => {
    if (pattern === "cross") {
      setPattern("dots");
    } else if (pattern === "dots") {
      setPattern("paper");
    } else {
      setPattern("cross");
    }
  };

  function patternStyles() {
    const defaultPattern =
      "z-5 absolute h-full w-full pattern-gray-400 dark:pattern-gray-600 pattern-bg-gray-300 dark:pattern-bg-gray-800 pattern-opacity-20 duration-150";
    if (pattern === "cross") {
      return defaultPattern + " pattern-cross pattern-size-8";
    } else if (pattern === "dots") {
      return defaultPattern + " pattern-dots pattern-size-6";
    } else {
      return defaultPattern + " pattern-paper pattern-size-6";
    }
  }

  const menuHandler = () => {
    setTranslate(!translate);
  };

  const fontInitializer = () => {
    if (font === "font-general") {
      setFont("font-satoshi");
    } else if (font === "font-satoshi") {
      // setFont("font-azeret");
      setFont("font-clash");
    } else if (font === "font-azeret") {
      setFont("font-clash");
    } else {
      setFont("font-general");
    }
  };

  return (
    <main className="relative overflow-hidden">
      <div className={font}>
        <Navbar
          pattern={pattern}
          patternBG={patternBG}
          menuHandler={menuHandler}
          fontInitializer={fontInitializer}
        />
        <button
          className="absolute bottom-4 right-4 z-20 rounded-2xl bg-gptDark p-2 text-white shadow-lg  duration-150 hover:bg-gptDarker"
          onClick={() => menuHandler()}
        >
          <ChatIcon className="h-12 w-12" />
        </button>
        <Chat translate={translate} setTranslate={setTranslate} />
        <div className="min-h-[calc(100vh-3.6rem)] overflow-hidden bg-gradient-to-b  from-gray-100 to-gray-200 duration-150 dark:from-gray-800 dark:to-gray-900 sm:max-h-[calc(100vh-3.6rem)] ">
          <div className={patternStyles()}></div>
          <Editor />
        </div>
      </div>
    </main>
  );
};

export default Home;
