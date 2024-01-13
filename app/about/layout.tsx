import { CoolHeader } from "@components/CoolHeader";
import { Footer } from "@components/Footer";
import { getEndPointName } from "@src/utils";
export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = getEndPointName(children, 1);
  return (
    <>
      <CoolHeader routeLabel={pathname} />
      {children}
      <Footer />
    </>
  );
}
