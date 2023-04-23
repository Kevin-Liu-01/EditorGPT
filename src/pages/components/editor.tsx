/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import React, { useState, useRef } from "react";
import Image from "next/image";
import Editor from "@monaco-editor/react";
import { runInNewContext } from "vm";
import Sk from "skulpt";
import Chat from "./chat";
import {
  TrashIcon,
  FolderDownloadIcon,
  PlayIcon,
  TerminalIcon,
  CodeIcon,
  CheckIcon,
} from "@heroicons/react/solid";

export default function CodeEditor() {
  const [value, setValue] = useLocalStorage(
    "CODE",
    "console.log('Hello World')"
  );
  const [logs, setLogs] = useLocalStorage("CONSOLE", []);
  const [language, setLanguage] = useLocalStorage("LANGUAGE", "javascript");
  const [title, setTitle] = useLocalStorage("TITLE", "Untitled Program");

  // Runner function
  function handleRunCode() {
    const sandbox = {
      console: {
        log: (message) => setLogs((prevLogs) => [...prevLogs, message]),
      },
    };

    try {
      const result = runInNewContext(value, sandbox);
      console.log(result); // Output: 8
    } catch (error) {
      console.error(error);
      setLogs((prevErrors) => [
        ...prevErrors,
        "R342WT43WTG45Error: " + error.message,
      ]);
    }
  }

  const handleExecutePython = () => {
    const outputArea = document.createElement("div");
    Sk.configure({
      output: (message) =>
        outputArea.appendChild(document.createTextNode(message)),
    });
    Sk.misceval
      .asyncToPromise(() =>
        Sk.importMainWithBody("<stdin>", false, value, true)
      )
      .then(() => {
        setLogs((prevLogs) => [...prevLogs, outputArea.innerHTML]);
      })
      .catch((error) => {
        console.error(error);
        setLogs((prevErrors) => [
          ...prevErrors,
          "R342WT43WTG45Error: " + error.toString(),
        ]);
      });
  };

  // useEffect(() => {
  //   setValue(
  //     React.Children.map(children, (child) => {
  //       return child.props.children;
  //     }).join("\n")
  //   );
  // }, [children]);

  const handleEditorChange = (value) => {
    setValue(value);
  };

  const handleConsole = (log, index) => {
    // if there is an error make the text red otherwise normal
    //AND IF THE LOG CONTAINS "R342WT43WTG45" REMOVE IT
    return (
      <li
        key={index}
        className="relative z-10 last:bg-gpt odd:bg-gray-300 even:bg-gray-200 dark:odd:bg-gray-800 dark:even:bg-[#2a3241]"
      >
        <li
          className={`${
            (log + "").includes("R342WT43WTG45")
              ? "grid grid-cols-8  bg-red-400 px-2 text-red-800"
              : "grid grid-cols-8 px-2 text-gptDark dark:text-gptLighter "
          }`}
        >
          <span className="max-w-4 col-span-1 w-4 pr-1 text-gray-500 dark:text-gray-600">
            {index + 1}
          </span>
          <span className="col-span-7">
            {(log + "").includes("R342WT43WTG45")
              ? (log + "").replace("R342WT43WTG45", "")
              : log}
          </span>
        </li>
      </li>
    );
  };

  // const runCode = () => {
  //   try {
  //     const fn = new Function(value);
  //     console.log(fn);

  //     const result = fn();
  //     console.log(result);
  //     setOutput(result.toString());
  //   } catch (error) {
  //     console.error(error);
  //     setOutput(error.toString());
  //   }
  // };

  const editorRef = useRef(null);

  function handleEditorDidMount(editor) {
    editorRef.current = editor;
  }

  const codeHandler = () => {
    if (language === "python") {
      return handleExecutePython();
    } else if (language === "javascript") {
      return handleRunCode();
    }
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([value], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = title + ".txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleConsoleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob(logs, { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = title + ".txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const languageHandler = () => {
    if (language === "python") {
      return (
        <Image
          src="/images/python.png"
          className="rounded-sm "
          height={400}
          width={400}
          alt="python"
        />
      );
    } else if (language === "javascript") {
      return (
        <Image
          src="/images/javascript.png"
          className="rounded-sm "
          height={400}
          width={400}
          alt="js"
        />
      );
    }
  };

  return (
    <section className="relative flex flex-col overflow-hidden">
      <div className="grid grid-cols-5 gap-0">
        <div className="overlay shadow-4xl col-span-3  flex h-full max-h-[calc(100vh-3.6rem)] min-h-[calc(100vh-3.6rem)] w-full flex-col overflow-hidden border-r border-gray-600">
          <div className="flex w-full flex-row items-center border-b border-gray-600 bg-gray-100 py-1 px-2  text-gray-800 dark:bg-gray-800 dark:text-gray-400">
            <CodeIcon className="mr-2 h-5 w-5" />
            <input
              onChange={(e) => setTitle(e.target.value)}
              value={title}
              className="rounded-lg border border-gray-300 bg-white px-2 py-0.5 text-lg font-semibold focus:outline-none focus:ring-1 focus:ring-gpt dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400"
            ></input>
            <div className="ml-auto flex flex-row items-center">
              <div className="mr-3 flex items-center text-sm italic text-gray-400">
                <CheckIcon className="mr-1 h-4 w-4 text-green-400" /> Saved
                Locally
              </div>
              <div className="relative inline-block text-gray-600">
                <select
                  value={language}
                  onChange={(event) => setLanguage(event.target.value)}
                  className="my-1 appearance-none rounded-lg border border-gray-300 bg-white bg-transparent py-0.5 pl-2 pr-8 focus:outline-none focus:ring-1 focus:ring-gpt dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400"
                >
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 ">
                  <div className="mb-0.5 h-[1rem] w-[1rem]">
                    {languageHandler()}
                  </div>
                </div>
              </div>

              <button
                onClick={codeHandler}
                className="m-1 flex items-center justify-center rounded-lg border border-gray-300 bg-white p-1 text-gray-900 duration-150 hover:bg-gray-100 hover:text-gpt dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-900 dark:hover:text-gptDark"
              >
                <PlayIcon className="h-5 w-5" />
              </button>
              <button
                className="my-1 mr-1 flex items-center justify-center rounded-lg border border-gray-300 bg-white p-1 text-gray-900 duration-150 hover:bg-gray-100 hover:text-gpt dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-900 dark:hover:text-gptDark"
                onClick={handleDownload}
              >
                <FolderDownloadIcon className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="grid h-full grid-rows-6 bg-gray-400 dark:bg-gray-900">
            <div className="row-span-3">
              <Editor
                className="border-0"
                theme={"vs-dark"}
                height={`100%`}
                width={`100%`}
                language={language || "javascript"}
                value={value}
                defaultValue="// some comment"
                onMount={handleEditorDidMount}
                onChange={handleEditorChange}
                options={{
                  selectOnLineNumbers: true,
                  roundedSelection: false,
                  readOnly: false,
                  cursorStyle: "line",
                  scrollbar: {
                    // Subtle shadows to the left & top. Defaults to true.
                    useShadows: false,
                    // Render vertical arrows. Defaults to false.
                    verticalHasArrows: true,
                    // Render horizontal arrows. Defaults to false.
                    horizontalHasArrows: true,
                    // Render vertical scrollbar.
                    // Accepted values: 'auto', 'visible', 'hidden'.
                    // Defaults to 'auto'
                    vertical: "visible",
                    // Render horizontal scrollbar.
                    // Accepted values: 'auto', 'visible', 'hidden'.
                    // Defaults to 'auto'
                    horizontal: "visible",
                    verticalScrollbarSize: 17,
                    horizontalScrollbarSize: 17,
                    arrowSize: 17,
                  },
                }}
              />
            </div>
            <Chat code={value} />
          </div>
        </div>
        <div className="col-span-2 flex max-h-[calc(100vh-3.6rem)] min-h-[calc(100vh-3.6rem)] w-full  flex-col overflow-hidden bg-gray-300 bg-opacity-10 dark:bg-gray-900 dark:bg-opacity-10">
          <div className="flex w-full flex-row items-center border-b border-gray-600 bg-gray-100 py-1 px-2 text-gray-800 dark:bg-gray-800 dark:text-gray-400">
            <div className="flex items-center text-lg font-semibold">
              <TerminalIcon className="mr-2 inline h-6 w-6" /> Console
            </div>
            <button
              className="m-1 ml-auto flex items-center justify-center rounded-lg border border-gray-300 bg-white p-1 text-gray-900 duration-150 hover:bg-gray-100 hover:text-red-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-900 dark:hover:text-red-500"
              onClick={() => setLogs([])}
            >
              <TrashIcon className="h-5 w-5" />
            </button>
            <button
              className="my-1 mr-1 flex items-center justify-center rounded-lg border border-gray-300 bg-white p-1 text-gray-900 duration-150 hover:bg-gray-100 hover:text-gpt dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-900 dark:hover:text-gptDark"
              onClick={handleConsoleDownload}
            >
              <FolderDownloadIcon className="h-5 w-5" />
            </button>
          </div>
          <div className="shadow-4xl scrollbar h-full w-full overflow-x-hidden overflow-y-scroll text-green-300">
            <div className="relative z-10 m-3 rounded-lg border border-gray-600 bg-gray-800 font-mono">
              <ul className="overflow-hidden rounded-lg">
                {logs[0] ? (
                  logs.map((log, index) => handleConsole(log, index))
                ) : (
                  <li className="relative z-10 rounded-lg last:bg-gpt odd:bg-gray-300 even:bg-gray-200 dark:odd:bg-gray-800 dark:even:bg-[#2a3241]">
                    <li className="grid grid-cols-8 px-2 ">
                      <span className="max-w-4 col-span-1 w-4 pr-1 text-gray-400 dark:text-gray-600">
                        1
                      </span>
                      <span className="col-span-7 text-gray-400 dark:text-gray-600 ">
                        Run to see an output!
                      </span>
                    </li>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function useLocalStorage<T>(key: string, initialValue: T) {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error also return initialValue
      console.log(error);
      return initialValue;
    }
  });
  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      // Save state
      setStoredValue(valueToStore);
      // Save to local storage
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.log(error);
    }
  };
  return [storedValue, setValue] as const;
}
