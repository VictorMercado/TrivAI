"use client";
import Image from "next/image";
import { FuturisticBox } from "./futuristic-box";
import { Check, Heart, Save, Share, createLucideIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@ui/popover";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@ui/hover-card";
import Link from "next/link";
import { shortenNumber } from "@trivai/lib/utils";
import { TQuizView } from "@trivai/lib/server/queries/quiz";
import { useState, useRef, useEffect } from "react";

type QuizCardProps = {
  quiz: TQuizView;
};

const RectInfo = createLucideIcon("Info", [
  [
    "rect",
    {
      width: "20",
      height: "20",
      x: "2",
      y: "2",
      key: "6G1vXw",
    },
  ],
  ["path", { d: "M12 16v-4", key: "1dtifu" }],
  ["path", { d: "M12 8h.01", key: "e9boi3" }],
]);

function dateFormat(date: Date | null | undefined) {
  if (date === null) {
    return undefined;
  }
  if (date === undefined) {
    return undefined;
  }
  const isoDate = date.toISOString().split("T")[0];
  return isoDate.slice(5) + "-" + isoDate.slice(2).slice(0, 2);
}

// TODO:
// add more stats:
// - who the quiz is assigned to
// - when it was created
// - how many questions are completed
const QuizCard = ({ quiz }: QuizCardProps) => {
  const [parentDimensions, setParentDimensions] = useState({
    width: 0,
    height: 0,
  });
  const [likes, setLikes] = useState(quiz.likes);
  const [saves, setSaves] = useState(quiz.saves);
  const [shares, setShares] = useState(quiz.shares);
  const [completions, setCompletions] = useState(quiz.completions);
  const ref = useRef<HTMLDivElement>(null);
  const status = quiz.status;
  const statusTextColor =
    status === "Completed"
      ? "text-green-500"
      : status === "Incomplete"
        ? "text-yellow-500"
        : "text-blue-500";

  const date = dateFormat(quiz?.dateDue);

  useEffect(() => {
    const handleResize = () => {
      if (ref.current) {
        setParentDimensions({
          width: ref.current.offsetWidth,
          height: ref.current.offsetHeight,
        });
      }
    };

    if (ref.current) {
      setParentDimensions({
        width: ref.current.offsetWidth,
        height: ref.current.offsetHeight,
      });
      window.addEventListener("resize", () => handleResize());
    }
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [ref]);

  return (
    <div
      className="group relative max-h-[450px] min-w-[350px] max-w-[700px] animate-bootUp @container md:min-w-[700px]"
      ref={ref}
    >
      <FuturisticBox
        titleLabel={`${quiz.quizCategory.category.name}`}
        rightSubLabel={String(quiz.scoreAmt)}
        detailLabel={
          quiz.quizCategory.theme
            ? String(quiz.quizCategory.theme.quizLength)
            : String(quiz.quizCategory.category.quizLength)
        }
        parentDimensions={parentDimensions}
      />
      <div className="h-full w-full animate-fadeIn">
        <a
          className={`z-10 flex`}
          key={quiz.id}
          href={`/quizzes/${quiz.id}`}
          aria-label={`quiz ${quiz.quizCategory.category.name}`}
        >
          {/* <img src={quiz.quizCategory.image} alt={quiz.quizCategory.category} className="w-64 h-64"/> */}
          <div className="flex w-full items-center px-8 pb-8 pt-14">
            <div className="grid w-full grid-cols-1 gap-2 @md:grid-cols-2 @md:gap-4">
              <div className="m-auto p-4">
                <Image
                  src="https://storage.googleapis.com/trivai-images/5-10-2023/FILMS/grid-0020.png"
                  width={500}
                  height={500}
                  alt="Quiz Image"
                  onLoad={(e) => {
                    if (ref.current) {
                      setParentDimensions({
                        width: ref.current.offsetWidth,
                        height: ref.current.offsetHeight,
                      });
                    }
                  }}
                />
                <p className="text-sm">
                  Created At: {new Date(quiz.createdAt).toDateString()}
                </p>
              </div>
              {/* <div className="flex items-center justify-center p-2">

              </div> */}
              <div className="flex h-full w-full flex-col gap-y-2 p-2 @md:gap-y-6 @md:p-4">
                <div className="hidden flex-col items-center gap-x-8 @md:flex">
                  <div>
                    {quiz.owner?.image ? (
                      <Image
                        src={quiz.owner.image}
                        width={100}
                        height={100}
                        alt=""
                      />
                    ) : null}
                    <div className="w-full text-center">
                      <h1 className={`text-md`}>{quiz.owner!.userName}</h1>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col justify-center">
                  <div className="grid grid-cols-2 gap-x-2 @lg:text-xl">
                    <p className="">Theme: </p>
                    <p className="flex justify-end text-right">
                      {quiz.quizCategory.theme?.name
                        ? quiz.quizCategory.theme.name
                        : "N/A"}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 @lg:text-xl">
                    <p className="">Status: </p>
                    <p
                      className={`${statusTextColor} flex justify-end text-right`}
                    >
                      {status}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 @lg:text-xl">
                    <p className="">Generated: </p>
                    <p className="flex justify-end text-right">
                      {quiz.genStatus}
                    </p>
                  </div>
                  {date && (
                    <div className="grid grid-cols-2 @lg:text-xl">
                      <p className="">Due Date: </p>
                      <p className="flex justify-end text-right">{date}</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="z-20 col-span-1 mb-6 grid grid-cols-4 items-center justify-center gap-x-2 px-4  pb-4 text-sm @md:col-span-2 @md:grid @md:grid-cols-4 @lg:pl-20 @lg:pr-8 @lg:text-xl">
                <button
                  className="grid grid-cols-2 items-center justify-center space-x-1 p-2 hover:bg-red-500/25 hover:ring-1 hover:ring-red-500 @md:space-x-2"
                  onClick={(e) => {
                    e.preventDefault();
                    console.log("liked");
                  }}
                >
                  <Heart className="m-auto h-4 w-4 stroke-red-500 lg:h-6 lg:w-6" />
                  <p>{shortenNumber(quiz.likes)}</p>
                </button>
                <button
                  className="grid grid-cols-2 items-center justify-center space-x-1 p-2 hover:bg-blue-500/25 hover:ring-1 hover:ring-blue-500 @md:space-x-2"
                  onClick={(e) => {
                    e.preventDefault();
                    console.log("saved");
                  }}
                >
                  <Save className="m-auto h-4 w-4 stroke-blue-500 lg:h-6 lg:w-6" />
                  <p>{shortenNumber(quiz.saves)}</p>
                </button>
                <button
                  className="grid grid-cols-2 items-center justify-center space-x-1 p-2 hover:bg-violet-500/25 hover:ring-1 hover:ring-violet-500 @md:space-x-2"
                  onClick={(e) => {
                    e.preventDefault();
                    console.log("shared");
                  }}
                >
                  <Share className="m-auto h-4 w-4 stroke-violet-500 lg:h-6 lg:w-6" />
                  <p>{shortenNumber(quiz.shares)}</p>
                </button>
                <button
                  className="grid grid-cols-2 items-center justify-center space-x-1 p-2 hover:bg-green-500/25 hover:ring-1 hover:ring-green-500 @md:space-x-2"
                  onClick={(e) => {
                    e.preventDefault();
                    console.log("completed");
                  }}
                >
                  <Check className="m-auto h-4 w-4 stroke-green-500 lg:h-6 lg:w-6" />
                  <p>{shortenNumber(quiz.completions)}</p>
                </button>
              </div>
            </div>
          </div>
        </a>
      </div>
      {/* Use popover for small devices that cant hover */}
      <Popover>
        <PopoverTrigger className="absolute right-0 top-0 z-20 h-[70px] w-[50px] outline-none @md:hidden"></PopoverTrigger>
        <PopoverContent
          aria-label="Quiz Question Point value"
          side="left"
          className=""
        >
          Points
        </PopoverContent>
      </Popover>
      {/* top right label */}
      <HoverCard defaultOpen={false} openDelay={200} closeDelay={200}>
        <HoverCardTrigger className="pointer-events-auto absolute right-0 top-0 z-20 hidden h-[75px] w-[75px] @md:block"></HoverCardTrigger>
        <HoverCardContent className="rounded-none" side="left" asChild>
          <p>Points</p>
        </HoverCardContent>
      </HoverCard>
      {/* Use popover for small devices that cant hover */}
      <Popover>
        <PopoverTrigger className="absolute bottom-0 left-0 z-20 h-[50px] w-[50px] outline-none @md:hidden"></PopoverTrigger>
        <PopoverContent aria-label="Quiz length" side="right" className="">
          Quiz length
        </PopoverContent>
      </Popover>
      {/* bottom left label */}
      <HoverCard defaultOpen={false} openDelay={200} closeDelay={200}>
        <HoverCardTrigger className="pointer-events-auto absolute bottom-0 left-0 z-20 hidden h-[75px] w-[75px] @md:block"></HoverCardTrigger>
        <HoverCardContent className="rounded-none" side="right">
          Quiz length
        </HoverCardContent>
      </HoverCard>
      {/* Use popover for small devices that cant hover */}
      <Popover>
        <PopoverTrigger className="absolute bottom-2 right-2 flex h-6 w-6 animate-fadeIn items-center justify-center @md:hidden">
          <RectInfo className="animate-pulse stroke-textBase" />
        </PopoverTrigger>
        <PopoverContent aria-label="Owner Information" className="p-2">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-full text-left">
              <h1 className={`text-xl`}>Owner</h1>
            </div>
            <Link href={`/profile/${quiz.owner!.userName}`}>
              {quiz.owner?.image ? (
                <Image src={quiz.owner.image} width={100} height={100} alt="" />
              ) : null}
              <div className="w-full text-center">
                <h1 className={`text-md`}>{quiz.owner!.userName}</h1>
              </div>
            </Link>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export { QuizCard };
