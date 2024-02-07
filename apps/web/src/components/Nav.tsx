import Link from "next/link";
import { TrivaiLogo } from "@ui/trivai-logo";
import { ProfilePicturePopover } from "./ProfilePicturePopover";
import { Slug } from "@ui/slug";
import type { UserState } from "@src/store";


type NavProps = {
  user?: UserState;
};

const Nav = ({user}: NavProps) => {
  return (
    <>
      <nav className="flex flex-row items-center justify-between gap-x-4 border-b border-primary/25 px-4 py-2 text-textBase transition delay-150 ease-in-out lg:flex-wrap lg:items-center lg:px-4">
        <div className="flex space-x-4 lg:space-x-10 text-base">
          <Link
            className=""
            href="/"
            title="HOME"
            alt-text="Home Link"
          >
            <TrivaiLogo />
          </Link>
          {/* <Link href="#main">Skip Navigation</Link> */}
          <Slug />
        </div>
        <div className="flex items-center gap-x-10">
          {/* @ts-expect-error Server Component */}
          <ProfilePicturePopover image={user?.image || "/default.png"} />
        </div>
      </nav>
      {/* {compoentWidth > 0 && componentHeight > 0 && <Starfield style="absolute pointer-events-none py-4" width={compoentWidth} height={componentHeight} />} */}
    </>
  );
}

export { Nav };