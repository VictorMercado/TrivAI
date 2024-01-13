import Link from "next/link";
import { getCurrentUser } from "@src/session";
import { CoolH1 } from "@/src/components/ui/cool-h1";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: any;
}) {
  const user = await getCurrentUser();
  return (
    <div aria-label="content">
      <div className="mb-6 flex justify-center md:mb-12">
        <CoolH1 text="Admin" />
      </div>
      {user?.role === "ADMIN" ? (
        <>
          <div className="tabs">
            <Link
              className="tab-s tab tab-bordered transition ease-in-out hover:tab-active md:tab-md lg:tab-lg"
              href="/admin"
            >
              <b>Live</b>
            </Link>
            <Link
              className="tab-s tab tab-bordered transition ease-in-out hover:tab-active md:tab-md lg:tab-lg"
              href="/admin/users"
            >
              <b>Users</b>
            </Link>
            <Link
              className="tab-s tab tab-bordered transition ease-in-out hover:tab-active md:tab-md lg:tab-lg"
              href="/admin/quiz"
            >
              <b>Quiz</b>
            </Link>
            <Link
              className="tab-s tab tab-bordered transition ease-in-out hover:tab-active md:tab-md lg:tab-lg"
              href="/admin/stablediffusionpreview"
            >
              <b>Stable Diffusion Preview</b>
            </Link>
          </div>
          {children}
        </>
      ) : (
        <>
          <h1 className="text-center text-3xl">Sneaky Sneaky</h1>
          <p> You are not authorized for this page.</p>
        </>
      )}
    </div>
  );
}
