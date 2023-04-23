/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useState, useEffect, type FormEvent } from "react";
// import { api } from "~/utils/api";
import { UserCircleIcon, TrashIcon } from "@heroicons/react/solid";
import { env } from "../../env.mjs";
import Typewriter from "typewriter-effect";
import { Configuration, OpenAIApi } from "openai";
import { XIcon } from "@heroicons/react/solid";
const configuration = new Configuration({
  apiKey: env.NEXT_PUBLIC_OPENAI_API,
});
// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
delete configuration.baseOptions.headers["User-Agent"];

const openai = new OpenAIApi(configuration);

// type Roles = "user" | "assistant" | "system";
export default function ChatGPT(props: {
  setTranslate: any;
  translate: boolean;
}) {
  const { data: session } = useSession();
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState([] as string[][]);

  //OpenAI integration
  // const [roles, setRoles] = useState<Roles>("user");
  const [submit, setSubmit] = useState(false);

  //request openai from api endpoint
  useEffect(() => {
    async function fetchData() {
      if (submit && message) {
        const context =
          history.length >= 2
            ? // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
              "The context for this conversation is as follows:" +
              "\nMy first prompt:" +
              history.slice(-2)?.[0]?.[1] +
              "\n Your first response:" +
              history.slice(-2)?.[1]?.[1] +
              "\n My new prompt:" +
              message +
              "\n Your new response:"
            : message;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
        history.push([session?.user?.name || "Guest", message]);
        const completion = await openai.createChatCompletion({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: context }],
          temperature: 1,
          max_tokens: 256,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0,
        });

        setHistory(
          // Replace the state
          [
            // with a new array
            ...history, // that contains all the old items
            ["EditorGPT", completion?.data?.choices[0]?.message?.content || ""], // and one new item at the end
          ]
        );
      }
    }
    void fetchData();
    setSubmit(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submit]);

  const handleQuery = (text: string) => {
    setQuery(text);
    setMessage(text);
  };

  const setSubmission = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmit(!submit);
    setQuery("");
  };

  const chatSelector = (msg: string) => {
    if (msg == session?.user?.name) {
      return (
        <Image
          src={(session && session.user.image) || ""}
          alt="avatar"
          className="mr-4 h-8 w-8 rounded-full"
          height={500}
          width={500}
        />
      );
    } else if (msg == "Guest") {
      return (
        <UserCircleIcon className="mr-2 inline h-8 w-8 rounded-full text-gray-800 dark:text-gray-400 sm:mb-1" />
      );
    } else {
      return (
        <>
          <Image
            src="/images/logo.svg"
            className="svgfill-gpt mb-0.5   mr-2 hidden h-8 w-8 dark:inline sm:mb-0 sm:mt-0.5"
            alt="ChatGPT"
            height={500}
            width={500}
          />
          <Image
            src="/images/logo.svg"
            className="mb-0.5 mr-2   inline h-8 w-8 dark:hidden sm:mb-0 sm:mt-0.5"
            alt="ChatGPT"
            height={500}
            width={500}
          />
        </>
      );
    }
  };

  const showChat = () => {
    if (props.translate) {
      return "absolute bottom-4 right-4 flex w-72 flex-col translate-x-0 duration-150 z-20";
    } else {
      return "absolute bottom-4 right-4 flex w-72 flex-col translate-x-[110%] duration-150 z-20";
    }
  };

  return (
    <section className={showChat()}>
      <div className="relative z-10 flex h-[100%] flex-col justify-between overflow-hidden rounded-2xl border border-gray-600">
        <div className="relative h-[100%] bg-gray-200 bg-opacity-90 duration-150 dark:bg-gray-200 dark:bg-opacity-10  ">
          <div className="relative z-10 border-b border-b-gray-600 bg-gray-50 p-4 duration-150 dark:bg-gray-800  ">
            <button
              // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
              onClick={() => props.setTranslate(!props.translate)}
              className="absolute right-4 h-8 w-8 "
            >
              <XIcon />
            </button>
            <p className="mb-2 select-none text-2xl font-semibold text-gray-800 duration-150 dark:text-white">
              Got a Question?
            </p>
            <div className="flex items-center">
              {session?.user.image ? (
                <Image
                  src={(session && session.user.image) || ""}
                  alt="avatar"
                  className="mr-4 h-10 w-10 rounded-full border-[1.5px] border-gray-900 text-gray-800 duration-150 dark:border-white dark:text-white"
                  height={500}
                  width={500}
                />
              ) : (
                <UserCircleIcon className="relative my-auto mr-2 inline h-10 w-10 rounded-full border-[1.5px] border-gray-900 text-gray-800 duration-150 dark:border-white dark:text-white sm:mb-1" />
              )}
              <p className="text-lg  text-gray-800 duration-150 dark:text-gray-100">
                {session && "Signed in as "}
                {session ? session.user.name : "Guest"}
              </p>
              <button
                className="ml-auto flex items-center rounded-xl bg-gptLight p-2 text-gray-900 duration-75 hover:bg-gpt dark:bg-gpt dark:text-white dark:hover:bg-gptDark"
                onClick={() => setHistory([])}
              >
                <TrashIcon className="inline h-6 w-6 lg:mr-1" />

                <span className="hidden lg:inline">Clear</span>
              </button>
            </div>
          </div>
          <div className="scrollbar flex h-[15rem] grow flex-col-reverse overflow-y-scroll bg-opacity-40 p-4 shadow-inner dark:bg-gray-800  dark:bg-opacity-40">
            <div className="z-10 flex flex-col">
              {history.map((msg, i) => (
                <div
                  key={i}
                  className="mb-3 flex flex-col rounded-lg bg-white p-2 px-4 duration-150  dark:bg-gray-800 "
                >
                  <div className="flex items-center">
                    {chatSelector(msg[0] || "")}
                    <p className="text-sm font-semibold text-gray-700 duration-150 dark:text-gray-200">
                      {msg[0]}:
                    </p>
                  </div>

                  <div className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                    {msg[0] == "EditorGPT" || msg[0] == "gpt-4" ? (
                      <Typewriter
                        options={{
                          loop: false,
                          delay: 20,
                          cursor: "",
                          autoStart: true,
                        }}
                        onInit={(typewriter) =>
                          typewriter.typeString(msg[1] || "").start()
                        }
                      />
                    ) : (
                      msg[1]
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className=" border-t border-gray-600 bg-gray-50 p-4 duration-150 dark:bg-gray-800">
          <form
            onSubmit={(e) => setSubmission(e)}
            className="flex items-center"
          >
            <input
              type="text"
              placeholder="Type a message..."
              className="w-full rounded-xl border  border-gray-300 bg-gray-100 py-2 px-4 text-gray-900 duration-150 focus:outline-none  focus:ring-2 focus:ring-gpt dark:border-gray-700 dark:bg-gray-600 dark:text-gray-200"
              value={query}
              onChange={(e) => handleQuery(e.target.value)}
            />
            <button
              type="submit"
              className="ml-2 flex items-center rounded-xl bg-gptLight py-1 px-2 text-white duration-150 ease-in-out hover:bg-gpt dark:bg-gpt dark:hover:bg-gptDark "
            >
              <Image
                src="/images/logo.svg"
                className=" inline h-8 w-8 "
                height={500}
                width={500}
                alt="ChatGPT"
              />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
