import Image from "next/image";
import ClientAbout from "./ClientAbout";

export default async function AboutPage() {
  return (
    <main className="">
      <a href="#feedback">
        <span className="sr-only">FeedBack</span>
      </a>
      {/* <Image
        className="m-auto"
        src={"https://storage.googleapis.com/trivai-images/trivaichart.png"}
        alt="Trivai Chart that explains how this webapp works"
        width={1000}
        height={1000}
      /> */}
      <ClientAbout />
    </main>
  );
}
