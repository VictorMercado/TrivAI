import { ServerBoard } from "./_components/ServerBoard";


export default function DashboardPage({ searchParams }: { searchParams: any }) {
  console.log("searchParams", searchParams);
  return (
    <div className="w-full flex-1">
      {/* @ts-ignore */}
      <ServerBoard />
    </div>
  );
}
