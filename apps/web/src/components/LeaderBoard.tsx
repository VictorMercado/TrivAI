import Link from "next/link";
import Image from "next/image";
import { getCurrentUser } from "@trivai/auth/lib/getCurrentUser";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import { prisma } from "@trivai/prisma";
import { use } from "react";

async function getUsers() {
  return await prisma.user.findMany({
    select: {
      id: true,
      email: false,
      userName: true,
      role: true,
      allegiance: {
        select: {
          allegiance: {
            select: {
              name: true,
            },
          },
        },
      },
      cheatUsed: true,
      totalScore: true,
      image: true,
      primaryColor: true,
      _count: {
        select: {
          ownedQuizzes: true,
          friendOf: true,
          profilePictures: true,
          friends: {
            where: {
              status: "ACCEPTED",
            },
          },
          userAnsweredQuizzes: {
            where: {
              completed: true,
            },
          },
        },
      },
    },
  });
}

const Leaderboard = () => {
  let user = use(getCurrentUser());

  const usersHead = [
    "Position",
    "Image",
    "User Name",
    "# of Collections",
    "Cheat Used",
    "KP",
  ];
  let users = use(getUsers());
  if (users.length > 0) {
    users.sort((a: any, b: any) => b.totalScore - a.totalScore);
  }

  return (
    <div className="overflow-x-auto">
      <h1 className="text-3xl">
        <b>Leaderboard</b>
      </h1>
      <table className="table mb-12 w-full bg-background" data-theme="">
        {/* <!-- head --> */}
        <thead className="border-2 border-black border-b-primary text-xl">
          <tr>
            {usersHead.map((entry: string, index: number) => (
              <th key={index}>{entry}</th>
            ))}
          </tr>
        </thead>
        <tbody className="">
          {/* <!-- row 1 --> */}
          {users.map((row, index) => (
            <tr
              className={`border border-black ${
                row.userName === user?.userName ? "text-primary" : ""
              }`}
              key={row.id}
            >
              <th className="border-b-gray-800 ">{index + 1}</th>
              <td className="border-b-gray-800">
                <div className="flex">
                  <HoverCard
                    defaultOpen={false}
                    openDelay={200}
                    closeDelay={200}
                  >
                    <HoverCardTrigger className="" asChild>
                      <Link href={"/profile/" + row.userName}>
                        <Image
                          unoptimized
                          style={{
                            borderColor:
                              row.primaryColor || "rgb(var(--color-primary))",
                          }}
                          className="border-2"
                          src={`${row.image}`}
                          alt="Picture of the author"
                          width={50}
                          height={50}
                        />
                      </Link>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-64 rounded-none">
                      {row.role === "ADMIN" ? (
                        <div className="coolBorder group flex flex-col ">
                          <p className="coolText underline group-hover:text-black">
                            {row.userName}
                          </p>
                          <p className="coolText group-hover:text-black">
                            quizzes: {row._count.ownedQuizzes}
                          </p>
                          <p className="coolText group-hover:text-black">
                            friends: {row._count.friendOf + row._count.friends}
                          </p>
                          <p className="coolText group-hover:text-black">
                            quizzes completed: {row._count.userAnsweredQuizzes}
                          </p>
                        </div>
                      ) : (
                        <div className="flex flex-col">
                          <p className="underline">{row.userName}</p>
                          <p className="">quizzes: {row._count.ownedQuizzes}</p>
                          <p className="">
                            friends: {row._count.friendOf + row._count.friends}
                          </p>
                          <p className="">
                            quizzes completed: {row._count.userAnsweredQuizzes}
                          </p>
                        </div>
                      )}
                    </HoverCardContent>
                  </HoverCard>
                </div>
              </td>
              <td className="border-b-gray-800">
                <Link href={"/profile/" + row.userName}>{row.userName}</Link>
              </td>
              <td className="border-b-gray-800">
                {row._count.profilePictures}
              </td>
              <td className="border-b-gray-800">{`${row.cheatUsed}`}</td>
              <td className="border-b-gray-800">
                {row.userName === "GalacticNet" ? "???" : row.totalScore}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export { Leaderboard };
