import { type NextPage } from "next";
import Image from "next/image";
import Link from "next/link";

const heading =
  "mt-8 text-2xl font-bold tracking-tight text-gray-900 dark:text-white";

const Privacy: NextPage = () => {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 font-general text-gray-700 dark:from-gray-800 dark:to-gray-900 dark:text-gray-300">
      <nav className="border-b border-gray-600 bg-white shadow-lg dark:bg-gray-900">
        <Link href="/" className="flex w-fit items-center">
          <Image
            src="/images/logo.svg"
            alt="logo"
            className="svgfill-gpt mx-2 inline h-12 w-12"
            height={400}
            width={400}
          />
          <span className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-gpt lg:text-4xl">
            EditorGPT
          </span>
        </Link>
      </nav>
      <article className="mx-auto max-w-2xl px-4 py-12 text-lg leading-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          Privacy
        </h1>
        <p className="mt-2 text-base text-gray-500">
          Last updated 5 November 2026
        </p>
        <p className="mt-6">
          EditorGPT is a code editor with a chat assistant, made by Kevin Liu.
        </p>

        <h2 className={heading}>Signing in</h2>
        <p className="mt-2">
          You can sign in with Google or Discord. From Google, EditorGPT
          receives your name, email address and profile picture. It shows your
          name and picture in the editor and does nothing with your email
          address.
        </p>

        <h2 className={heading}>Where it&apos;s kept</h2>
        <p className="mt-2">
          EditorGPT has no database and saves nothing about you on a server.
          Your sign-in is kept in a cookie in your browser until you sign out,
          or for 30 days after your last visit. Your code is saved in your
          browser&apos;s local storage until you clear it.
        </p>

        <h2 className={heading}>Chat</h2>
        <p className="mt-2">
          Chat messages go to OpenAI to write the reply. Your name and email
          address are not sent.
        </p>

        <h2 className={heading}>Sharing</h2>
        <p className="mt-2">Nothing about you is sold or shared.</p>

        <h2 className={heading}>Deleting your data</h2>
        <p className="mt-2">
          Sign out to delete the cookie, and clear this site&apos;s data in your
          browser to delete your code. You can remove EditorGPT&apos;s access at{" "}
          <a
            className="text-gptDarker underline dark:text-gpt"
            href="https://myaccount.google.com/connections"
          >
            myaccount.google.com/connections
          </a>
          . To ask about anything else, email{" "}
          <a
            className="text-gptDarker underline dark:text-gpt"
            href="mailto:k.bowen.liu@gmail.com"
          >
            k.bowen.liu@gmail.com
          </a>
          .
        </p>
      </article>
    </main>
  );
};

export default Privacy;
