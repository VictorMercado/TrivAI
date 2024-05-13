"use client";
import Image from "next/image";
import { FuturisticBox } from "./futuristic-box";
import {
  Check,
  Heart,
  Save,
  Share,
  createLucideIcon,
  MoreVertical,
  Scroll,
  RotateCcw,
  Users,
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@ui/popover";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@ui/hover-card";
import Link from "next/link";
import { shortenNumber } from "@trivai/lib/utils";
import { TQuizView } from "@trivai/lib/server/queries/quiz";
import { useState, useRef, useEffect } from "react";
import { Button } from "./button";
import { useSession } from "next-auth/react";
import { trpc } from "@t/client";
import { useToast } from "@ui/toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@ui/dialog";
import { useRouter } from "next/navigation";


{/* <svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="lucide lucide-ellipsis"
>
  <circle cx="12" cy="12" r="1" />
  <circle cx="19" cy="12" r="1" />
  <circle cx="5" cy="12" r="1" />
</svg>; */}

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

type QuizCardProps = {
  quiz: TQuizView;
};
// TODO:
// add more stats:
// - who the quiz is assigned to
// - when it was created
// - how many questions are completed
const QuizCard = ({ quiz }: QuizCardProps) => {
  const router = useRouter();
  const { addToast } = useToast();
  const utils = trpc.useUtils();
  const { data: session } = useSession();
  const user = session?.user;
  const friends = trpc.authViewer.friend.getAll.useQuery();
  const [parentDimensions, setParentDimensions] = useState({
    width: 0,
    height: 0,
  });
  const [likes, setLikes] = useState({ count: quiz.likes, liked: false });
  // const [saves, setSaves] = useState({ count: quiz.saves, saved: false });
  // const [shares, setShares] = useState({ count: quiz.shares, shared: false});
  // const [completions, setCompletions] = useState({ count: quiz.completions, completed: false});
  const ref = useRef<HTMLDivElement>(null);
  const status = quiz.status;
  const statusTextColor =
    status === "Completed"
      ? "text-green-500"
      : status === "Incomplete"
        ? "text-yellow-500"
        : "text-blue-500";

  const date = dateFormat(quiz?.dateDue);
  const { data : rooms, isLoading } = trpc.authViewer.quiz.getRooms.useQuery({quizId: quiz.id});

  const resetQuiz = trpc.authViewer.user.resetQuizAnswers.useMutation({
    onSuccess: () => {
      addToast({
        id: Math.random(),
        message: "Quiz has been successfully reset",
        type: "success",
      });
      utils.authViewer.user.invalidate();
    },
    onError: (error) => {
      addToast({
        id: Math.random(),
        message: error.message,
        type: "error",
      });
    },
  });
  const handleResetQuiz = (quizId: number, userId: string) => {
    resetQuiz.mutate({ quizId, userId });
  }

  const assignQuiz = trpc.authViewer.quiz.assignQuiz.useMutation({
    onSuccess: () => {
      addToast({
        id: Math.random(),
        message: "Quiz has been successfully assigned",
        type: "success",
      });
    },
    onError: (error) => {
      addToast({
        id: Math.random(),
        message: error.message,
        type: "error",
      });
    },
  });

  const handleAssign = (quizId: number, userId: string, assigneeId: string) => {
    assignQuiz.mutate({ quizId, userId, assigneeId });
  }

  const createMultiplayerQuiz = trpc.authViewer.quiz.createMultiplayer.useMutation({
    onError: (error) => {
      addToast({
        id: Math.random(),
        message: error.message,
        type: "error",
      });
    },
  });

  const handleCreateMultiplayer = (quizId: number, roomId: string) => {
    createMultiplayerQuiz.mutate({ quizId, roomId });
  };

  const deleteQuiz = trpc.authViewer.quiz.delete.useMutation({
    onSuccess: () => {
      addToast({
        id: Math.random(),
        message: "Quiz has been successfully deleted",
        type: "success",
      });
      utils.authViewer.quiz.invalidate();
      utils.authViewer.user.invalidate();
    },
    onError: (error) => {
      addToast({
        id: Math.random(),
        message: error.message,
        type: "error",
      });
    },
  
  });

  const handleDelete = (id : number, userId : string ) => {
    deleteQuiz.mutate({id, userId});
  };

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
                {quiz.image ? (
                  <Image
                    unoptimized
                    src={quiz.image}
                    width={200}
                    height={200}
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
                ) : (
                  <Scroll className="h-[120px] w-[225px] md:h-[140px] md:w-[275px]"></Scroll>
                )}
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
                        unoptimized
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
                    <p className="">ID: </p>
                    <p className="flex justify-end text-right">{quiz.id}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-x-2 @lg:text-xl">
                    <p className="">Theme: </p>
                    <p className="flex justify-end text-nowrap text-right">
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
                <HoverCard defaultOpen={false} openDelay={200} closeDelay={200}>
                  <HoverCardTrigger
                    className="pointer-events-auto col-start-2"
                    asChild
                  >
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
                  </HoverCardTrigger>
                  <HoverCardContent
                    side="top"
                    className="border-red-500 p-2 text-sm text-red-500"
                  >
                    <p>Likes</p>
                  </HoverCardContent>
                </HoverCard>
                {/* <HoverCard defaultOpen={false} openDelay={200} closeDelay={200}>
                  <HoverCardTrigger asChild>
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
                  </HoverCardTrigger>
                  <HoverCardContent
                    side="top"
                    className="border-blue-500 p-2 text-sm text-blue-500"
                  >
                    <p>Saves</p>
                  </HoverCardContent>
                </HoverCard> */}
                {/* <HoverCard defaultOpen={false} openDelay={200} closeDelay={200}>
                  <HoverCardTrigger asChild>
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
                  </HoverCardTrigger>
                  <HoverCardContent
                    side="top"
                    className="border-violet-500 p-2 text-sm text-violet-500"
                  >
                    <p>Shares</p>
                  </HoverCardContent>
                </HoverCard> */}
                <HoverCard defaultOpen={false} openDelay={200} closeDelay={200}>
                  <HoverCardTrigger asChild>
                    <div className="grid grid-cols-2 items-center justify-center space-x-1 p-2 hover:bg-green-500/25 hover:ring-1 hover:ring-green-500 @md:space-x-2">
                      <Users className="m-auto h-4 w-4 stroke-green-500 lg:h-6 lg:w-6" />
                      <p>{shortenNumber(rooms?.length ? rooms?.length : 0)}</p>
                    </div>
                  </HoverCardTrigger>
                  <HoverCardContent
                    side="top"
                    className="text-md border-green-500 p-2 text-sm text-green-500"
                  >
                    <p>Multiplayer Rooms</p>
                  </HoverCardContent>
                </HoverCard>
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
        <PopoverTrigger className="absolute bottom-2 right-2 flex h-6 w-6 animate-fadeIn items-center justify-center">
          <MoreVertical className="animate-pulse stroke-textBase" />
        </PopoverTrigger>
        <PopoverContent aria-label="Owner Information" className="p-6">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-full text-left">
              <h1 className={`text-xl`}>Owner</h1>
            </div>
            <Link href={`/profile/${quiz.owner!.userName}`}>
              {quiz.owner?.image ? (
                <Image
                  unoptimized
                  src={quiz.owner.image}
                  width={100}
                  height={100}
                  alt=""
                />
              ) : null}
              <div className="w-full text-center">
                <h1 className={`text-md`}>{quiz.owner!.userName}</h1>
              </div>
            </Link>
            <div className="flex flex-col">
              <Button
                variant="default"
                size="default"
                className="w-full"
                title="reset your quiz answers"
                onClick={() => {
                  handleResetQuiz(quiz.id, user!.id);
                }}
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset Answers
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="default"
                    size="default"
                    className=""
                    onClick={() => {}}
                  >
                    View Multiplayer Quizzes
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Multiplayer Quizzes</DialogTitle>
                    <DialogClose />
                  </DialogHeader>
                  <DialogDescription>Click to Join</DialogDescription>
                  <div className="flex flex-col gap-y-4">
                    {!isLoading &&
                      rooms &&
                      rooms.map((room) => (
                        <Button
                          variant="default"
                          size="default"
                          className="w-full"
                          key={room.id}
                          onClick={() => {
                            router.push(
                              `/quizzes/${quiz.id}/multiplayer?roomid=${room.roomId}`,
                            );
                          }}
                        >
                          {room.roomId}
                        </Button>
                      ))}
                  </div>
                </DialogContent>
              </Dialog>
              <Button
                variant="default"
                size="default"
                className="w-full"
                onClick={() => {
                  // if (quiz.owner?.userName === user?.userName) {

                  //   router.push(
                  //     `/quizzes/${quiz.id}/multiplayer?roomid=${roomId}`,
                  //   );
                  // } else {
                  //   router.push(`/quizzes/${quiz.id}/multiplayer?roomid=${quiz.roomId}`);
                  // }
                  const roomId = `${user?.userName}_${quiz.id}`;
                  if (!rooms?.find((room) => room.roomId === roomId)) {
                    handleCreateMultiplayer(quiz.id, roomId);
                  }
                  router.push(
                    `/quizzes/${quiz.id}/multiplayer?roomid=${roomId}`,
                  );
                }}
              >
                Start Multiplayer Quiz
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="default"
                    size="default"
                    className=""
                    onClick={() => {}}
                  >
                    Assign Quiz
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Assign Quiz</DialogTitle>
                  </DialogHeader>
                  <DialogDescription>
                    Assign this quiz to a friend
                  </DialogDescription>
                  <div className="flex flex-col gap-y-4">
                    {friends &&
                      friends.data &&
                      friends?.data.map((friend) => (
                        <DialogClose key={friend.id} asChild>
                          <Button
                            variant="default"
                            size="default"
                            className="w-full"
                            onClick={() => {
                              handleAssign(quiz.id, user!.id, friend.id);
                            }}
                          >
                            {friend.userName}
                          </Button>
                        </DialogClose>
                      ))}
                  </div>
                </DialogContent>
              </Dialog>
              {quiz.owner?.userName === user?.userName ? (
                <Button
                  variant="default"
                  size="default"
                  className=""
                  onClick={() => {
                    handleDelete(quiz.id, user!.id);
                  }}
                >
                  Delete
                </Button>
              ) : null}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export { QuizCard };
