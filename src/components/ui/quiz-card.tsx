import Image from "next/image";
import { type MergedUserAssignedQuiz } from "@src/db/helpers";
import { FuturisticBox } from "./futuristic-box";

const QuizCard = ({ quiz }: { quiz: MergedUserAssignedQuiz }) => {
  const status = quiz.status;
  const statusTextColor =
    status === "Completed"
      ? "text-green-500"
      : status === "Incomplete"
      ? "text-yellow-500"
      : "text-blue-500";
  return (
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
                <Image src="/evilCorp.svg" width={150} height={150} alt="" />
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
                  <p className={`${statusTextColor} lg:text-xl`}>{status}</p>
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
  );
};

export { QuizCard };