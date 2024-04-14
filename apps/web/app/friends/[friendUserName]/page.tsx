import { ProfilePage } from "@components/ProfilePage";

type ProfileIdPageProps = {
  params: {
    friendUserName: string;
  };
};

export default async function Page({ params }: ProfileIdPageProps) {
  // @ts-ignore
  return <ProfilePage userName={params.friendUserName} />;
}