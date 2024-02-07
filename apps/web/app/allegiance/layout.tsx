
export default function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: any;
}) {
  return <div className="p-4">{children}</div>;
}
