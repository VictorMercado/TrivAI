import { getCurrentUser } from "@src/session";
import { db } from "@src/db";
import { SettingsActions } from "./_components/SettingsActions";
import { SettingsForm } from "./_components/SettingsForm";

async function getProfilePictures() {
  return await db.profilePicture.findMany({
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
  const user = await getCurrentUser();
  if (!user) {
    return <main className="">you are not signed in</main>;
  }
  const pictures: Array<ProfilePicture> = await getProfilePictures();
  return (
    <div className="flex items-center justify-center text-xl">
      <div className="grid grid-cols-1 gap-12 font-bold lg:grid-cols-2">
        <SettingsForm profilePictures={pictures} />
        <SettingsActions />
      </div>
    </div>
  );
}
