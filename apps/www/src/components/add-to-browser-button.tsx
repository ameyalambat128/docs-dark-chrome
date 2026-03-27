"use client"; // required if using in App Router pages

import Link from "next/link";
import Image from "next/image";

const browsers = [
  {
    name: "Chrome",
    icon: "/browser-icons/chrome.svg",
    link: "https://chromewebstore.google.com/detail/docs-dark-20/djmmkojigpkdagglmjjdjiddopgdchcn?authuser=0&hl=en",
    match: /Chrome/i,
  },
  {
    name: "Firefox",
    icon: "/browser-icons/firefox.svg",
    link: "https://addons.mozilla.org/en-US/firefox/addon/dark-docs-2-0/",
    match: /Firefox/i,
  },
  {
    name: "Edge",
    icon: "/browser-icons/edge.svg",
    link: "https://chromewebstore.google.com/detail/docs-dark-20/djmmkojigpkdagglmjjdjiddopgdchcn?authuser=0&hl=en",
    match: /Edg/i,
  },
  {
    name: "Opera",
    icon: "/browser-icons/opera.svg",
    link: "https://chromewebstore.google.com/detail/docs-dark-20/djmmkojigpkdagglmjjdjiddopgdchcn?authuser=0&hl=en",
    match: /Opera|OPR/i,
  },
];

function detectBrowser() {
  if (typeof window === "undefined") return browsers[0];
  const ua = navigator.userAgent;
  return browsers.find((browser) => browser.match.test(ua)) || browsers[0]; // Default to Chrome if no match
}

export default function AddToBrowserButton() {
  const browser = detectBrowser();

  return (
    <div className="flex gap-4">
      <Link
        href={browser.link}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-black shadow-sm transition hover:bg-gray-100"
      >
        <Image
          src={browser.icon}
          alt={`${browser.name} icon`}
          width={20}
          height={20}
          className="h-5 w-5"
        />
        Add to {browser.name}
      </Link>
    </div>
  );
}
