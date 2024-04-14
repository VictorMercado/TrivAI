import { getEndPointName } from "@trivai/lib/utils";

export default function Layout({ children }: { children: any; params: any }) {
  return <div className="p-4">{children}</div>;
}
