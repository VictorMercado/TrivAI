import Image from "next/image";
import { type MergedUserAssignedQuiz } from "@src/db/helpers";
import { FuturisticBox } from "./futuristic-box";
import { Check, Heart, Info, Save, Share, createLucideIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@ui/popover";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@ui/hover-card";
import Link from "next/link";
import { shortenNumber } from "@src/utils";

const QuizCard = ({ quiz }: { quiz: any }) => {
  const status = quiz.status;
  const statusTextColor =
    status === "Completed"
      ? "text-green-500"
      : status === "Incomplete"
      ? "text-yellow-500"
      : "text-blue-500";
  const isoDate = new Date(quiz.dateDue).toISOString().split("T")[0];
  const date = isoDate.slice(5) + "-" + isoDate.slice(2).slice(0,2);
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
  
  return (
    <div className="@container animate-bootUp group relative ">
      <FuturisticBox
        titleLabel={`${quiz.quizCategory.category.name}`}
        rightSubLabel={quiz.scoreAmt}
        detailLabel={quiz.quizCategory.keywordPrompt.quizLength}
      />
      <div className="h-full w-full animate-fadeIn">
        <a
          className={`z-10 flex`}
          key={quiz.id}
          href={`/quizzes/${quiz.id}`}
          aria-label={`quiz ${quiz.quizCategory.category.name}`}
        >
          {/* <img src={quiz.quizCategory.image} alt={quiz.quizCategory.category} className="w-64 h-64"/> */}
          <div className="flex w-full items-center px-8 pb-8 pt-12">
            <div className="@md:grid-cols-2 @md:gap-4 grid w-full grid-cols-1 gap-2">
              <Image
                src="https://storage.googleapis.com/trivai-images/5-10-2023/FILMS/grid-0020.png"
                width={500}
                height={500}
                className="m-auto p-4"
                alt="Quiz Image"
              />
              {/* <div className="flex items-center justify-center p-2">

              </div> */}
              <div className="@md:gap-y-6 @md:p-4 flex h-full w-full flex-col gap-y-2 p-2">
                <div className="@md:flex hidden flex-col items-center gap-x-8">
                  <div>
                    <Image
                      src={quiz.owner.image}
                      width={100}
                      height={100}
                      alt=""
                    />
                    <div className="w-full text-center">
                      <h1 className={`text-md`}>{quiz.owner.userName}</h1>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col justify-center">
                  <div className="@lg:text-xl grid grid-cols-2 gap-x-2">
                    <p className="">Theme: </p>
                    <p className="flex justify-end">
                      {quiz.quizCategory?.keywordPrompt?.keyword}
                    </p>
                  </div>
                  <div className="@lg:text-xl grid grid-cols-2">
                    <p className="">Status: </p>
                    <p className={`${statusTextColor} flex justify-end`}>
                      {status}
                    </p>
                  </div>
                  <div className="@lg:text-xl grid grid-cols-2">
                    <p className="">Due Date: </p>
                    <p className="flex justify-end">{date}</p>
                  </div>
                </div>
              </div>
              <div className="@md:grid @md:grid-cols-4 @md:col-span-2 @lg:text-xl z-20 col-span-1 grid grid-cols-2 items-center justify-center gap-x-2 py-4 px-8 text-sm">
                <div className="@md:space-x-2 pointer-events-auto grid grid-cols-2 items-center justify-center space-x-1 p-2 hover:border-red-500">
                  <Heart className="m-auto h-4 w-4 stroke-red-500" />
                  <p>{shortenNumber(1000)}</p>
                </div>
                <div className="@md:space-x-2 grid grid-cols-2 items-center justify-center space-x-1 p-2">
                  <Save className="m-auto h-4 w-4 stroke-blue-500" />
                  <p>{shortenNumber(75)}</p>
                </div>
                <div className="@md:space-x-2 grid grid-cols-2 items-center justify-center space-x-1 p-2">
                  <Share className="m-auto h-4 w-4 stroke-violet-500" />
                  <p>{shortenNumber(50000)}</p>
                </div>
                <div className="@md:space-x-2 grid grid-cols-2 items-center justify-center space-x-1 p-2">
                  <Check className="m-auto h-4 w-4 stroke-green-500" />
                  <p>{shortenNumber(100000)}</p>
                </div>
              </div>
            </div>
          </div>
        </a>
      </div>
      {/* Use popover for small devices that cant hover */}
      <Popover>
        <PopoverTrigger className="@md:hidden absolute right-0 top-0 z-20 h-[70px] w-[50px] outline-none"></PopoverTrigger>
        <PopoverContent aria-label="Quiz Question Point value" className="">
          Points
        </PopoverContent>
      </Popover>
      {/* top right label */}
      <HoverCard defaultOpen={false} openDelay={200} closeDelay={200}>
        <HoverCardTrigger className="@md:block pointer-events-auto absolute right-0 top-0 z-20 hidden h-[75px] w-[75px]"></HoverCardTrigger>
        <HoverCardContent className="rounded-none" asChild>
          <p>Points</p>
        </HoverCardContent>
      </HoverCard>
      {/* Use popover for small devices that cant hover */}
      <Popover>
        <PopoverTrigger className="@md:hidden absolute bottom-0 left-0 z-20 h-[50px] w-[50px] outline-none"></PopoverTrigger>
        <PopoverContent aria-label="Quiz length" className="">
          Quiz length
        </PopoverContent>
      </Popover>
      {/* bottom left label */}
      <HoverCard defaultOpen={false} openDelay={200} closeDelay={200}>
        <HoverCardTrigger className="@md:block pointer-events-auto absolute bottom-0 left-0 z-20 hidden h-[75px] w-[75px]"></HoverCardTrigger>
        <HoverCardContent className="rounded-none">
          Quiz length
        </HoverCardContent>
      </HoverCard>
      {/* Use popover for small devices that cant hover */}
      <Popover>
        <PopoverTrigger className="@md:hidden absolute bottom-2 right-2 flex h-6 w-6 animate-fadeIn items-center justify-center">
          <RectInfo className="animate-pulse stroke-textBase" />
        </PopoverTrigger>
        <PopoverContent aria-label="Owner Information" className="">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-full text-center">
              <h1 className={`text-xl`}>Owner</h1>
            </div>
            <Link href={`/profile/${quiz.owner.userName}`}>
              <Image className="m-auto" src={quiz.owner.image} width={50} height={50} alt="" />
              <div className="w-full text-center">
                <h1 className={`text-md`}>{quiz.owner.userName}</h1>
              </div>
            </Link>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export { QuizCard };