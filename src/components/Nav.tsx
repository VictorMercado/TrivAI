import Link from "next/link";
import { TrivaiLogo } from "@ui/trivai-logo";
import { ProfilePicturePopover } from "./ProfilePicturePopover";
import type { UserState } from "@src/store";


type NavProps = {
  user?: UserState;
};

const Nav = ({user}: NavProps) => {
  return (
    <>
      <nav className="flex flex-row items-center justify-between gap-x-4 border-b border-primary/25 px-4 py-2 transition delay-150 ease-in-out lg:flex-wrap lg:items-center lg:px-4 text-textBase">
        <Link
          className="mb-2 text-2xl md:text-3xl"
          href="/"
          title="HOME"
          alt-text="Home Link"
        >
          <TrivaiLogo />
        </Link>
        {/* <Link href="#main">Skip Navigation</Link> */}
        <div className="flex items-center gap-x-10">
          <ProfilePicturePopover image={user?.image || "/default.png"} />
        </div>
      </nav>
      {/* {compoentWidth > 0 && componentHeight > 0 && <Starfield style="absolute pointer-events-none py-4" width={compoentWidth} height={componentHeight} />} */}
    </>
  );
}

export { Nav };