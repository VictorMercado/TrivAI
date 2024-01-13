import { getEndPointName } from "@/src/utils";
import { CoolHeader } from "@components/CoolHeader";

export default function Layout({ children }: { children: any; params: any }) {
  const pathname = getEndPointName(children, 1);
  return (
    <main>
      <CoolHeader routeLabel={pathname} />
      {children}
    </main>
  );
}
