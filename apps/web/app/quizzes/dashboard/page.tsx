import { ServerBoard } from "./_components/ServerBoard";
import { getCurrentUser } from "@trivai/auth/lib/getCurrentUser";

export default async function DashboardPage({ searchParams }: { searchParams: any }) {
  const user = await getCurrentUser(); 
  console.log("searchParams", searchParams);
  return (
    <div className="w-full flex-1">
      {
        user ? (
          /* @ts-ignore */
          <ServerBoard />
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <h1 className="text-2xl">Please login to view the dashboard</h1>
          </div>
        )
      }
    </div>
  );
}
