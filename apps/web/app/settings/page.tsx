import { getCurrentUser } from "@trivai/auth/lib/getCurrentUser";
import { prisma } from "@trivai/prisma";
import { SettingsActions } from "./_components/SettingsActions";
import { SettingsForm } from "./_components/SettingsForm";
import { getUserWithProperties } from "@trivai/lib/server/queries/user";

async function getProfilePictures() {
  return await prisma.profilePicture.findMany({
    where: {
      gen: 1,
    },
    select: {
      name: true,
      image: true,
    },
    take: 100,
  });
}

export type ProfilePicture = {
  name: string;
  image: string;
};

export default async function SettingsPage() {
  const userSession = await getCurrentUser();

  if (!userSession) {
    return <main className="">you are not signed in</main>;
  }
  const user = await getUserWithProperties({
    userId: userSession?.id,
    properties: ["userName", "email"],
  });
  const pictures: Array<ProfilePicture> = await getProfilePictures();
  return (
    <main className="flex items-center justify-center text-xl">
      <div className="grid grid-cols-1 gap-12 font-bold lg:grid-cols-2">
        <div className="flex flex-col gap-y-10">
          <p>Email: {user?.email}</p>
          <SettingsForm profilePictures={pictures} />
        </div>
        <SettingsActions />
      </div>
    </main>
  );
}
