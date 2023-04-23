/** @type {import('tailwindcss').Config} */
// import 'tailwindcss-bg-patterns';

const config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        hanken: ["Hanken Grotesk", "Inter"],
        general: ["General Sans", "Inter"],
        azeret: ["Azeret Mono", "Inter"],
        clash: ["Clash Grotesk", "Inter"],
        satoshi: ["Satoshi", "Inter"],
      },
      colors: {
        gpt: "#21da68",
        gptLight: "#34e276",
        gptLighter: "#53f892",
        gptLightest: "#93ffbd",
        gptDark: "#17c158",
        gptDarker: "#13ab4d",
      },
    },
  },
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  plugins: [require("tailwindcss-bg-patterns")],
};

module.exports = config;
