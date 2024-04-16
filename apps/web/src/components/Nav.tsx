import Link from "next/link";
import { TrivaiLogo } from "@ui/trivai-logo";
import { ProfilePicturePopover } from "./ProfilePicturePopover";
import { Slug } from "@ui/slug";
import { Suspense } from "react";

const Nav = () => {
  return (
    <>
      <nav className="flex flex-row items-center justify-between gap-x-4 border-b border-primary/25 px-4 py-2 text-textBase transition delay-150 ease-in-out lg:flex-wrap lg:items-center lg:px-4">
        <div className="flex space-x-4 text-base lg:space-x-10">
          <Link className="" href="/" title="HOME" alt-text="Home Link">
            <TrivaiLogo />
          </Link>
          {/* <Link href="#main">Skip Navigation</Link> */}
          <Slug />
        </div>
        <div className="flex items-center gap-x-10">
          <Suspense
            fallback={<img width="36" height="36" src="/default.png" />}
          >
            <ProfilePicturePopover />
          </Suspense>
        </div>
      </nav>
      {/* {compoentWidth > 0 && componentHeight > 0 && <Starfield style="absolute pointer-events-none py-4" width={compoentWidth} height={componentHeight} />} */}
    </>
  );
};

export { Nav };

