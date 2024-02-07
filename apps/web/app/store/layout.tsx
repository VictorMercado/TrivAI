export default function Layout({children} : {children: React.ReactNode}) {
  return (
    <div className="p-4">
      <h1>Layout</h1>
      {children}
    </div>
  );
}