import { Box } from "./_components/box";
import { QuizCard } from "@ui/quiz-card";
import { prisma } from "@trivai/prisma";
import { TabSwitcher } from "@ui/tab-switcher";
import { FuturisticBox } from "@ui/futuristic-box";
import { useLocalStorage } from "@/src/hooks/useLocalStorage";
import Image from "next/image";
import { Button } from "@/src/components/ui/button";
import { Boxes, Heart, Share, Check } from "lucide-react";
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
  const quiz = await prisma.quiz.findUnique({
    where: { id },
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
  return quiz;
}

function Box4() {
  return (
    <div className="relative bg-primary/20 text-primary">
      <div className="absolute left-0 top-0 grid h-full w-full grid-cols-2">
        <div className="h-full w-full">
          <div className="h-1/2 w-1/2 animate-scale-in border-l border-t border-primary"></div>
        </div>
        <div className="flex h-full w-full justify-end">
          <div className="h-1/2 w-1/2 animate-scale-in border-r border-t border-primary"></div>
        </div>
        <div className="flex h-full w-full items-end">
          <div className="h-1/2 w-1/2 animate-scale-in border-b border-l border-primary"></div>
        </div>
        <div className="flex h-full w-full items-end justify-end">
          <div className="h-1/2 w-1/2 animate-scale-in border-b border-r border-primary"></div>
        </div>
      </div>
      <div className="flex h-full w-full items-center justify-center p-2">
        <div className="text-center">Dude was good</div>
      </div>
    </div>
  );
}

export default async function StorePage() {
  const quiz = await getQuiz(336);
  console.log(quiz);
  const charizardProduct: Product = {
    name: "Charizard",
    identifier: "Gen 1 Pokemon",
    description: "A fire breathing dragon",
    price: 100,
    imageUrl: "/charizard-3.gif",
  };
  const RayquezaProduct: Product = {
    name: "Rayqueza",
    identifier: "Gen 3 Pokemon",
    description: "A flying dragon",
    price: 100,
    imageUrl: "/bulbasaur.gif",
  };

  return (
    <div className="grid grid-cols-2 gap-10 p-4 md:grid-cols-2 2xl:grid-cols-4">
      {/* <h1>Store Page</h1>
      <TabSwitcher
        routes={["store", "quiz", "results", "profile", "settings"]}
      /> */}
      {/* <Box itemsCount={10} />
      <Box itemsCount={5} />
      <Box4 /> */}
      {/* <pre>{JSON.stringify(quiz, null, 2)}</pre> */}
      <QuizCard quiz={quiz} />
      <QuizCard quiz={quiz} />
      {/* <QuizCard quiz={quiz} /> */}
      {/* <QuizCard quiz={quiz} /> */}
      <div className="grid hidden grid-cols-2 gap-x-1 gap-y-1">
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
      {/* <svg
        width="500"
        height="500"
        viewBox="0 0 353 294"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="animate-bootUp"
      >
        <path
          d="M186.093 46.0007L161.928 26.0007L179.045 26.0007L203.21 46.0007L186.093 46.0007Z"
          className="fill-green-500"
        />
        <path
          d="M215.796 46.0007L191.631 26.0007L208.747 26.0007L232.912 46.0007L215.796 46.0007Z"
          className="fill-green-500"
        />
        <path
          d="M244.995 46.0001L220.83 26.0002L237.947 26.0002L262.112 46.0001L244.995 46.0001Z"
          className="fill-green-500"
        />
        <path
          d="M273.187 46L249.022 26L266.139 26L290.304 46L273.187 46Z"
          className="fill-green-500"
        />
        <path
          d="M301.883 46.0001L277.718 26.0001L294.835 26.0002L319 46.0001L301.883 46.0001Z"
          className="fill-green-500"
        />
        <path
          d="M288.063 255.791L282.819 260.791L292.888 260.791L298.563 255.791H288.063Z"
          className="fill-green-500"
        />
        <path
          d="M319 224.783L313.5 230V241L319 236V224.783Z"
          className="fill-green-500"
        />
        <path
          d="M310.38 233.111L304.842 238.32L304.94 249.19L310.44 244.19L310.38 233.111Z"
          className="fill-green-500"
        />
        <path
          d="M301.565 252.5V243L292 252.5H301.565Z"
          className="fill-green-500"
        />
        <path
          d="M279.244 264L274 269L284.069 269L289.744 264H279.244Z"
          className="fill-green-500"
        />
        <path
          d="M188 262.501H268L312 219.001V115.001"
          className="stroke-primary"
        />
        <path
          d="M312 109.001L315.464 111.001V115.001L312 117.001L308.536 115.001V111.001L312 109.001Z"
          fill="#00B0BC"
        />
        <path d="M288 269H319V240L288 269Z" stroke="#00B0BC" />
        <path
          d="M151 26H26V269H270.5L319 220.933V51H181L151 26Z"
          className="stroke-primary"
        />
      </svg> */}
    </div>
  );
}
