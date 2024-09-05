import Image from "next/image";
import { prisma } from "@trivai/prisma";
import { notFound } from "next/navigation";
import { Sparkle } from "@components/Sparkle";
import { AllegiancePicturePopover } from "@components/AllegiancePicturePopover";
import { Sword } from "lucide-react";
import { QuizCard } from "@/src/components/ui/quiz-card";
import { getUserOwnedQuizzes } from "@trivai/lib/server/queries/quiz";
import { mergeQuizzesView } from "@trivai/lib/server/queries/quiz/helpers";
import { HorizontalScroll } from "@ui/horizontal-scroll";
import { getUsersByScore } from "@trivai/lib/server/queries/user";
import { serverRouter } from "@/app/_trpc/serverRouter";
import { ProfilePictureCard } from "./ProfilePictureCard";

export type ProfileIdPageProps = {
  userName: string;
};

const ProfilePage = async ({ userName }: ProfileIdPageProps) => {
  const router = await serverRouter();
  const user = await prisma.user.findUnique({
    where: {
      userName: userName,
    },
    select: {
      id: true,
      userName: true,
      allegiance: {
        select: {
          allegiance: {
            select: {
              name: true,
              image: true,
            },
          },
        },
      },
      // rank: true,
      image: true,
      prize: true,
      totalScore: true,
      credits: true,
      primaryColor: true,
      userAnsweredQuizzes: {
        select: {
          id: true,
          quizId: true,
          completed: true,
          time: true,
        },
        orderBy: {
          quizId: "asc",
        },
      },
      collection: true,
    },
  });
  if (!user) {
    notFound();
  }
  const users = await getUsersByScore();
  const rank = users.findIndex((u) => u.id === user.id) + 1;
  const userOwnedQuizzes = await getUserOwnedQuizzes(user.id);
  const quizzesToView = mergeQuizzesView(
    userOwnedQuizzes,
    user.userAnsweredQuizzes,
  ).reverse();

  const quizzesCompleted = user.userAnsweredQuizzes.reduce(
    (acc: number, quiz) => {
      if (quiz.completed === true) {
        acc++;
      }
      return acc;
    },
    0,
  );
  const userProfilePictures = await router.viewer.user.getProfilePictures({
    userId: user.id,
  });

  return (
    <main className="container mx-auto space-y-4 p-4">
      <div
        className="flex w-full flex-col space-y-4 border border-primary p-4 lg:space-y-4 lg:p-12"
        style={{
          borderColor: user.primaryColor || "",
        }}
      >
        <div className="grid grid-cols-2 lg:col-span-2 lg:items-center">
          <div className="flex flex-col items-center gap-y-2 lg:flex-row lg:justify-center lg:gap-x-5">
            <Image
              unoptimized
              className={`border-2 ${user.userName === "GalacticNet" ? "" : "bg-primary"}`}
              style={{
                borderColor: user.primaryColor || "",
              }}
              src={user.image === null ? "/default.png" : user.image}
              alt="Profile"
              width={100}
              height={100}
            />
            <h1 className="text-2xl">{user.userName}</h1>
          </div>
          {/*
          <div className="flex flex-col items-center gap-y-2 lg:flex-row lg:justify-center lg:gap-x-5">
            {user.allegiance === null && false ? ( //
              <>
                <div className="flex h-[100px] w-[100px] items-center justify-center border-2 border-primary text-primary">
                  <Sword className="h-12 w-12" />
                </div>
                <p className="order-last text-2xl lg:order-first">
                  No Allegiance
                </p>
              </>
            ) : (
              <>
                <h1 className="order-last text-center text-2xl lg:order-first">
                  The Brotherhood
                </h1>
                <AllegiancePicturePopover
                  // image={user.allegiance.allegiance.image}
                  // route={"/allegiance/" + user.allegiance.allegiance.name}
                  // name={user.allegiance.allegiance.name}
                  name={"The Brotherhood"}
                  image={"/default.png"}
                  route={"/allegiance"}
                  size={100}
                />
              </>
            )}
          </div>
          */}
        </div>

        <div className="grid w-full md:grid-cols-2">
          <div className="flex flex-col">
            <div className="mx-auto space-y-4">
              <Image
                src="/charizard-megax.gif"
                alt="Profile"
                width={400}
                height={400}
              />
              <p className="coolText text-center">Prize Possesion</p>
            </div>
          </div>

          <div
            className="space-y-2 bg-primary/25 p-4 md:p-6"
            style={{
              color: user.primaryColor || "",
              backgroundColor: `${user.primaryColor}50` || "",
            }}
          >
            <div>Rank: {rank}</div>
            <div>Quizzes Completed: {quizzesCompleted} </div>
            {/* <div>Cheats Used: 20 </div> */}
            <div>Knowledge Points: {user.totalScore}</div>
            <div>Credits: {user.credits}</div>
            <div>Average Quiz Grade Percent: N/A</div>
            <div>Best Category: N/A</div>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="flex justify-between pb-4">
          <h1
            style={{
              backgroundColor: `${user.primaryColor}50` || "",
            }}
            className="w-fit p-4 text-xl"
          >
            Collections: ({userProfilePictures?.length})
          </h1>
          <h1
            style={{
              backgroundColor: `${user.primaryColor}50` || "",
            }}
            className="w-fit p-4 text-xl"
          >
            Quizzes: ({userOwnedQuizzes.length})
          </h1>
        </div>
        <HorizontalScroll>
          {quizzesToView.map((theQuiz) => {
            return <QuizCard quiz={theQuiz} key={theQuiz.id} />;
          })}
        </HorizontalScroll>

        <div className="grid grid-cols-3 justify-center">
          {userProfilePictures?.map(({ profilePicture }, _index) => {
            return (
              <ProfilePictureCard
                key={profilePicture.id + _index}
                product={profilePicture}
                isBuy={false}
              />
            );
          })}
        </div>
      </div>
    </main>
  );
};

export { ProfilePage };