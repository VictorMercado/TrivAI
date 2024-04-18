import { User } from "@components/User";
import Link from "next/link";
import { serverRouter } from "@/app/_trpc/serverRouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ui/tabs";
import { getCurrentUser } from "@trivai/auth/lib/getCurrentUser";
import { Friends } from "@components/Friends";
interface Friend {
  id: number;
  name: string;
  userName: string;
  image: string;
  prize: string;
  totalScore: number;
  credits: number;
}

// const friends: Friend[] = [
//   { id: 1, name: "Alice", userName: "alice", image: "https://via.placeholder.com/100", prize: "1st", totalScore: 100, credits: 1000 },
//   { id: 2, name: "Bob", userName: "bob", image: "https://via.placeholder.com/100", prize: "2nd", totalScore: 90, credits: 900 },
//   { id: 3, name: "Charlie", userName: "charlie", image: "https://via.placeholder.com/100", prize: "3rd", totalScore: 80, credits: 800 },
// ];

export default async function Layout({
  children,
}: {
  children: any;
  params: any;
}) {
  const user = await getCurrentUser();
  const router = await serverRouter();
  const friends = await router.authViewer.friend.getAll();
  return (
    <div className="flex h-full flex-col md:flex-row">
      <div className="w-full border-primary/50 py-2 md:w-1/3 md:border-r">
        <div className="flex justify-center">
          {/* <div className="flex space-x-10">
            <h1>Friends</h1>
            <h1>Quizzes</h1>
          </div> */}
          <Tabs
            defaultValue="friends"
            className="flex w-full flex-col items-center"
          >
            <TabsList>
              <TabsTrigger value="friends">Friends</TabsTrigger>
              <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
            </TabsList>
            <TabsContent value="friends" className="w-full" tabIndex={-1}>
              <div className="hideScroll flex w-screen overflow-auto p-2 md:w-full md:flex-col md:space-x-0 md:space-y-2">
                {friends ? (
                  <Friends friends={friends} sessionUserId={user!.id} />
                ) : (
                  <div>Loading...</div>
                )}
              </div>
            </TabsContent>
            <TabsContent value="quizzes">
              Drag quizzes to friends profile
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <div className="w-full">{children}</div>
    </div>
  );
}
