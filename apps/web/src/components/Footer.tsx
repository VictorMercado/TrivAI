import Image from "next/image";

function Footer() {
  return (
    // lg:absolute lg:bottom-0 lg:right-0
    <footer className="flex items-center justify-between p-4">
      <div>
        <h1 className="coolText mb-2 text-3xl">Created By: Victor Mercado</h1>
      </div>
      <div className="grid grid-cols-1 p-4 md:grid-cols-2 ">
        <a
          href="https://nextjs.org/"
          className="flex p-2 hover:ring hover:ring-primary"
          rel="noopener noreferrer"
          target="_blank"
        >
          <Image
            className="invert-[var(--invert)]"
            src="/next.svg"
            alt="Next.js Logo"
            width={90}
            height={50}
            priority
          />
        </a>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
          className="flex space-x-2 p-2 hover:ring hover:ring-primary"
        >
          <span>By</span>
          <Image
            src="/vercel.svg"
            alt="Vercel Logo"
            className="invert-[var(--invert)]"
            width={100}
            height={500}
            priority
          />
        </a>
      </div>
    </footer>
  );
}

export { Footer };
