import { QuizGenController } from "@components/QuizGenController";
import { serverRouter } from "@/app/_trpc/serverRouter";
import { getCurrentUser } from "@trivai/auth/lib/getCurrentUser";

export default async function Layout({
  children,
  params,
}: {
  children: any;
  params: any;
}) {
  const user = await getCurrentUser();
  const router = await serverRouter();
  if(!user) {
    return(
      <div>
        Please log in
      </div>
    );
  }
  const categories = await router.authViewer.category.getAll();
  const friends = await router.authViewer.friend.getAll();
  
  return (
    <div className="flex flex-col flex-1 lg:flex-row">
      <div className="min-w-48 border border-primary/25 p-4">
        <QuizGenController categories={categories} friends={friends} />
      </div>
      {children}
    </div>
  );
}
