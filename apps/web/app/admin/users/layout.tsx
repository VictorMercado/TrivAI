import { getEndPointName } from "@/src/utils";
export default function Layout({children} : {children: any}) {
  const pathname = getEndPointName(children, 2);
  return (
    <>
      {children}
    </>
  );
}