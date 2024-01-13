import { CoolHeader } from "@/src/components/CoolHeader";
import { getEndPointName } from "@/src/utils";
export default function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: any;
}) {
  const pathname = getEndPointName(children, 1);
  return (
    <>
      <CoolHeader routeLabel={pathname} />
      {children}
    </>
  );
}
