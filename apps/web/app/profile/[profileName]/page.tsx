import Image from "next/image";
import { prisma } from "@trivai/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Sparkle } from "@components/Sparkle";
import { AllegiancePicturePopover } from "@components/AllegiancePicturePopover";
import { Sword } from "lucide-react";
import { QuizCard } from "@/src/components/ui/quiz-card";

type ProfileIdPageProps = {
  params: {
    profileName: string;
  };
};

export default async function ProfilePage({
  params: { profileName },
}: ProfileIdPageProps) {
  const user = await prisma.user.findUnique({
    where: {
      userName: profileName,
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
      userAnswerQuiz: {
        select: {
          quizId: true,
          completed: true,
          time: true,
          userAnswers: {
            select: {
              questionId: true,
              correctAnswer: true,
              selectedAnswer: true,
            },
          },
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
  const userOwnedQuizzes = await prisma.quiz.findMany({
    where: {
      ownerId: user.id,
    },
    select: {
      id: true,
      scoreAmt: true,
      allegianceQuiz: true,
      sharedQuiz: true,
      owner: true,
      dateDue: true,
      quizCategory: {
        select: {
          category: true,
          keywordPrompt: true,
        },
      },
    },
  });

  const quizzesCompleted = user.userAnswerQuiz.reduce((acc: number, quiz) => {
    if (quiz.completed === true) {
      acc++;
    }
    return acc;
  }, 0);
  return (
    <main className="container mx-auto space-y-4 p-4">
      <div className="flex w-full flex-col space-y-4 border border-primary p-4 lg:space-y-4 lg:p-12">
        <div className="grid grid-cols-2 lg:col-span-2 lg:items-center">
          <div className="flex flex-col items-center gap-y-2 lg:flex-row lg:justify-center lg:gap-x-5">
            <Image
              className="border-2 border-primary bg-primary "
              src={user.image === null ? "/default.png" : user.image}
              alt="Profile"
              width={100}
              height={100}
            />
            <h1 className="text-2xl">{user.userName}</h1>
          </div>

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
                  {/* {user.allegiance.allegiance.name} */}
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

          <div className="space-y-2 bg-primary/25 p-4 text-primary md:p-6">
            <div>Rank: 1</div>
            <div>Quizzes Completed: {quizzesCompleted} </div>
            <div>Cheats Used: 20 </div>
            <div>Points: {user.totalScore}</div>
            <div>Credits: {user.credits}</div>
            <div>Average Quiz Grade Percent: N/A</div>
            <div>Best Category: N/A</div>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="flex justify-between pb-4">
          <h1 className="w-fit bg-primary/25 p-4 text-xl">Collections: (12)</h1>
          <h1 className="w-fit bg-primary/25 p-4 text-xl">
            Quizzes: ({user.userAnswerQuiz.length})
          </h1>
        </div>
        <div className="grid grid-cols-1 gap-y-4 lg:grid-cols-2 lg:space-x-4">
          {userOwnedQuizzes.map((theQuiz) => {
            return <QuizCard quiz={theQuiz} key={theQuiz.id} />;
          })}
        </div>

        <ul className="grid grid-cols-3 justify-center lg:grid-cols-6">
          <ol className="m-auto">
            <div className="mx-auto w-fit">
              {/* leaving this img here to test the difference */}
              <img
                src="/pikachu-hoenncap.gif"
                alt="Pikachu"
                width={125}
                height={125}
              />
            </div>
          </ol>
          <ol className="m-auto">
            <div className="mx-auto w-fit">
              <Sparkle>
                <Image
                  src="/charizard-megax.gif"
                  alt="Charizard"
                  width={125}
                  height={125}
                />
              </Sparkle>
            </div>
          </ol>
          <ol className="m-auto">
            <div className="mx-auto w-fit">
              <Image src="/lugia.gif" alt="Lugia" width={125} height={125} />
            </div>
          </ol>
          <ol className="m-auto">
            <div className="mx-auto w-fit">
              <Image
                src="/lugia-shiny.gif"
                alt="Shiny Lugia"
                width={125}
                height={125}
              />
            </div>
          </ol>
          <ol className="m-auto">
            <div className="mx-auto w-fit">
              <Image src="/ho-oh.gif" alt="Ho-oh" width={125} height={125} />
            </div>
          </ol>
          <ol className="m-auto">
            <div className="mx-auto w-fit">
              <Image
                src="/mewtwo.gif"
                alt="Shiny Ho-oh"
                width={125}
                height={125}
              />
            </div>
          </ol>
          <ol className="m-auto">
            <div className="mx-auto w-fit">
              <Image src="/mew.gif" alt="Mew" width={125} height={125} />
            </div>
          </ol>
          <ol className="m-auto">
            <div className="mx-auto w-fit">
              <Image
                src="/pikachu-gigantamax.gif"
                alt="pikachu"
                width={125}
                height={125}
              />
            </div>
          </ol>
          <ol className="m-auto">
            <div className="mx-auto w-fit">
              <Image
                src="/charmander.gif"
                alt="Pikachu"
                width={125}
                height={125}
              />
            </div>
          </ol>
          <ol className="m-auto">
            <div className="mx-auto w-fit">
              <Image
                src="/rayquaza.gif"
                alt="Rayquaza"
                width={125}
                height={125}
              />
            </div>
          </ol>
          <ol className="m-auto">
            <div className="mx-auto w-fit">
              <Sparkle>
                <Image
                  src="/rayquaza-mega.gif"
                  alt="rayquaza-mega"
                  width={125}
                  height={125}
                />
              </Sparkle>
            </div>
          </ol>
          <ol className="m-auto">
            <div className="mx-auto w-fit">
              <Image
                src="/zygarde.gif"
                alt="zygarde"
                width={125}
                height={125}
              />
            </div>
          </ol>
        </ul>
      </div>
    </main>
  );
}
