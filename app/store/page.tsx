import { Box } from "./_components/box";
import { QuizCard } from "@ui/quiz-card";
import { db } from "@src/db";
import { TabSwitcher } from "@ui/tab-switcher";
import { FuturisticBox } from "@ui/futuristic-box";
import { useLocalStorage } from "@/src/hooks/useLocalStorage";
import Image from "next/image";
import { Button } from "@/src/components/ui/button";
import { Boxes } from "lucide-react";
import { ProfilePictureCard } from "@components/ProfilePictureCard";
import { ItemCard } from "@components/ItemCard";

type Product = {
  name: string;
  identifier: string;
  description: string;
  price: number;
  imageUrl: string;
};

async function getQuiz(id: number) {
  const quiz = await db.quiz.findUnique({
    where: { id },
    select: {
      id: true,
      scoreAmt: true,
      allegianceQuiz: true,
      sharedQuiz: true,
      owner: true,
      quizCategory: {
        select: {
          category: true,
          keywordPrompt: true,
        },
      },
    },
  });
  return quiz;
}

function Box4() {
  return (
    <div className="relative bg-primary/20 text-primary">
      <div className="absolute left-0 top-0 grid h-full w-full grid-cols-2">
        <div className="h-full w-full">
          <div className="animate-scale-in h-1/2 w-1/2 border-l border-t border-primary"></div>
        </div>
        <div className="flex h-full w-full justify-end">
          <div className="animate-scale-in h-1/2 w-1/2 border-r border-t border-primary"></div>
        </div>
        <div className="flex h-full w-full items-end">
          <div className="animate-scale-in h-1/2 w-1/2 border-b border-l border-primary"></div>
        </div>
        <div className="flex h-full w-full items-end justify-end">
          <div className="animate-scale-in h-1/2 w-1/2 border-b border-r border-primary"></div>
        </div>
      </div>
      <div className="flex h-full w-full items-center justify-center p-2">
        <div className="text-center">Dude was good</div>
      </div>
    </div>
  );
}


export default async function StorePage() {
  const quiz = await getQuiz(1);
  const charizardProduct: Product = {
    name: "Charizard",
    identifier: "Gen 1 Pokemon",
    description: "A fire breathing dragon",
    price: 100,
    imageUrl:
      "/charizard-3.gif",
  };
  const RayquezaProduct: Product = {
    name: "Rayqueza",
    identifier: "Gen 3 Pokemon",
    description: "A flying dragon",
    price: 100,
    imageUrl: "/bulbasaur.gif",
  };

  return (
    <div className="grid grid-cols-1 gap-10 p-4 lg:grid-cols-2">
      {/* <h1>Store Page</h1>
      <TabSwitcher
        routes={["store", "quiz", "results", "profile", "settings"]}
      /> */}
      {/* <Box itemsCount={10} />
      <Box itemsCount={5} />
      <Box4 /> */}
      {/* <pre>{JSON.stringify(quiz, null, 2)}</pre> */}
      <div className="flex space-x-2">
        <ItemCard product={charizardProduct} />
        <ItemCard product={RayquezaProduct} />
        <ProfilePictureCard
          product={{
            name: "001-bulbasaur-amazed",
            description: "Default Picture",
            imageUrl: "/001-bulbasaur-amazed.png",
            price: 50,
            identifier: "Pokemon",
          }}
        />
        <ProfilePictureCard product={charizardProduct} />
      </div>
      {quiz && (
        <FuturisticBox
          titleLabel="Flims"
          rightSubLabel="5"
          detailLabel="10"
          rightSubLabelDescription="Points"
          detailLabelDescription="Questions Length"
        >
          <a
            className={`flex h-full w-full`}
            key={quiz.id}
            href={`/quizzes/${quiz.id}`}
            aria-label={`quiz ${quiz.quizCategory.category.name}`}
          >
            {/* <img src={quiz.quizCategory.image} alt={quiz.quizCategory.category} className="w-64 h-64"/> */}
            <div className="flex w-full items-center px-8 py-10">
              <div className="grid w-full grid-cols-2 gap-4">
                <div className="flex items-center">
                  <Image
                    src="https://storage.googleapis.com/trivai-images/5-10-2023/FILMS/grid-0020.png"
                    width={300}
                    height={350}
                    className=""
                    alt="Quiz Image"
                  />
                </div>
                <div className="flex h-full w-full flex-col gap-y-4 md:gap-y-12">
                  <div className="flex flex-col items-center gap-x-8 md:flex-row">
                    <Image
                      src="/evilCorp.svg"
                      width={150}
                      height={150}
                      alt=""
                    />
                    <h1 className={`text-md`}>Evil_Corp.exe</h1>
                  </div>
                  <div className="flex flex-col justify-center">
                    <div className="grid grid-cols-2">
                      <p className="lg:text-xl">Theme: </p>
                      <p className="lg:text-xl">
                        {quiz.quizCategory?.keywordPrompt?.keyword}
                      </p>
                    </div>
                    <div className="grid grid-cols-2">
                      <p className="lg:text-xl">Status: </p>
                      <p className="text-green-500 lg:text-xl">Completed</p>
                    </div>
                    <div className="grid grid-cols-2">
                      <p className="lg:text-xl">Due Date: </p>
                      <p className="lg:text-xl">12/30/23</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </a>
        </FuturisticBox>
      )}
      {/* <QuizCard quiz={{}}/> */}
    </div>
  );
}
