import { Footer } from "@components/Footer";
import { getEndPointName } from "@src/utils";
export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="p-4">
      {children}
      <Footer />
    </div>
  );
}
