import { type MergedUserAssignedQuiz } from "@src/db/helpers";


function Box4({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative bg-green-500/20 text-green-500">
      <div className="pointer-events-none absolute left-0 top-0 z-0 grid h-full w-full grid-cols-2">
        <div className="h-full w-full">
          <div className="animate-scale-in h-1/2 w-1/2 border-l border-t border-current"></div>
        </div>
        <div className="flex h-full w-full justify-end">
          <div className="animate-scale-in h-1/2 w-1/2 border-r border-t border-current"></div>
        </div>
        <div className="flex h-full w-full items-end">
          <div className="animate-scale-in h-1/2 w-1/2 border-b border-l border-current"></div>
        </div>
        <div className="flex h-full w-full items-end justify-end">
          <div className="animate-scale-in h-1/2 w-1/2 border-b border-r border-current"></div>
        </div>
      </div>
      <div className="z-10 h-full w-full p-2 shadow-lg shadow-green-500/50">
        {children}
      </div>
    </div>
  );
}

// this component will be used to present quizzes to the user
// TODO: create a type for quizzes
const PresentCategories = ({
  quizzes,
  className,
}: {
  quizzes: Array<MergedUserAssignedQuiz>;
  className?: string;
}) => {
  return (
    <div
      className={`grid grid-cols-2 justify-center gap-x-4 gap-y-6 font-bold md:gap-6 lg:gap-12`}
    >
      {quizzes.map((quiz) => {
        const status = quiz.status;
        const statusTextColor =
          status === "Completed"
            ? "text-green-500"
            : status === "Incomplete"
            ? "text-yellow-500"
            : "text-blue-500";
        const statusBorderColor =
          status === "Completed"
            ? "border-green-500"
            : status === "Incomplete"
            ? "border-yellow-500"
            : "border-blue-500";
        const statusHoverBackgroundColor =
          status === "Completed"
            ? "hover:bg-green-500"
            : status === "Incomplete"
            ? "hover:bg-yellow-500"
            : "hover:bg-blue-500";
        return (
          <Box4 key={quiz.id}>
          <div
            //className={`h-full border-b-2 ${statusBorderColor} ${statusTextColor} flex flex-col`}
            className={`h-full ${statusBorderColor} ${statusTextColor} flex flex-col`}
            key={quiz.id}
          >
            <div className="flex justify-between">
              <h1 className={`text-xl`}>{quiz.quizCategory.category.name}</h1>
              <h1 className={`text-md`}>5</h1>
            </div>
            <div
              // className={`h-full border-t-2 ${statusTextColor} ${statusBorderColor} ${statusHoverBackgroundColor} bg-green-500/20 transition-colors ease-in-out hover:text-black`} 
              className={`h-full ${statusTextColor} ${statusBorderColor} ${statusHoverBackgroundColor} transition-colors ease-in-out hover:text-black`}
            >
              <a
                className={`group grid h-full grid-cols-1 md:grid-cols-3 md:space-x-4 md:p-4 md:justify-center`}
                key={quiz.id}
                href={`/quizzes/${quiz.id}`}
                aria-label={`quiz ${quiz.quizCategory.category.name}`}
              >
                {/* <img src={quiz.quizCategory.image} alt={quiz.quizCategory.category} className="w-64 h-64"/> */}
                <div className="hidden md:flex flex-col items-center justify-center border-r-2 border-green-500 group-hover:border-black">
                  <div className="h-24 w-24 bg-slate-500"></div>
                  <h1 className={`text-md`}>The BrotherHood</h1>
                </div>
                <div className="cols-span-1 md:col-span-2">
                  <div className="flex justify-center">
                    <div className="flex w-min flex-col items-center justify-center">
                      <div>
                        <div className="h-36 w-36 bg-slate-600 lg:h-64 lg:w-72"></div>
                      </div>
                      <div className="flex w-full flex-col">
                        <div className="grid grid-cols-2">
                          <p className="lg:text-xl">Theme: </p>
                          <p className="lg:text-xl">
                            {quiz.quizCategory?.keywordPrompt?.keyword}
                          </p>
                        </div>
                        <div className="grid grid-cols-2">
                          <p className="lg:text-xl">Status: </p>
                          <p className="lg:text-xl">{quiz.status}</p>
                        </div>
                        <div className="grid grid-cols-2">
                          <p className="lg:text-xl">Length: </p>
                          <p className="lg:text-xl">10</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </a>
            </div>
          </div>
          </Box4> 
        );
        // return (
        //   <div
        //     className={`border-b-2 ${statusBorderColor} ${statusTextColor} flex flex-col`}
        //     key={quiz.id}
        //   >
        //     <div className="flex justify-between">
        //       <h1 className={`text-xl`}>{quiz.quizCategory.category.name}</h1>
        //       <h1 className={`text-md`}>5</h1>
        //     </div>
        //     <div
        //       className={`h-full border-t-2 ${statusTextColor} ${statusBorderColor} ${statusHoverBackgroundColor} bg-green-500/20 transition-colors ease-in-out hover:text-black`}
        //     >
        //       <a
        //         className={`h-full flex flex-row  p-4 md:justify-center space-x-4`}
        //         key={quiz.id}
        //         href={`/quizzes/${quiz.id}`}
        //         aria-label={`quiz ${quiz.quizCategory.category.name}`}
        //       >
        //         {/* <img src={quiz.quizCategory.image} alt={quiz.quizCategory.category} className="w-64 h-64"/> */}
        //         <div className="flex h-full w-full flex-col border-r border-green-500 items-center">
        //           <div className="h-24 w-24 bg-slate-500"></div>
        //           <h1 className={`text-md`}>The BrotherHood</h1>
        //         </div>
        //         <div>
        //           <div className="h-36 w-44 bg-slate-600 sm:h-44 sm:w-60 lg:h-48 lg:w-72"></div>
        //           <div className="flex h-full w-full flex-col px-6">
        //             <div className="grid grid-cols-2 ">
        //               <p className="text-center lg:text-xl">Theme: </p>
        //               <p className="lg:text-xl">
        //                 {quiz.quizCategory?.keywordPrompt?.keyword}
        //               </p>
        //             </div>
        //             <div className="grid grid-cols-2">
        //               <p className="text-center lg:text-xl">Status: </p>
        //               <p className="lg:text-xl">{quiz.status}</p>
        //             </div>
        //             <div className="grid grid-cols-2">
        //               <p className="text-center lg:text-xl">Length: </p>
        //               <p className="lg:text-xl">10</p>
        //             </div>
        //           </div>
        //         </div>
        //       </a>
        //     </div>
        //   </div>
        // );
        // return (
        //   <a
        //     className={`flex flex-col items-center md:justify-center p-4 border-2 hover:text-black ${
        //       status === "Completed"
        //         ? "border-green-500 text-green-500 hover:bg-green-500"
        //         : "border-blue-500 text-blue-500 hover:bg-blue-500"
        //     }`}
        //     key={quiz.id}
        //     href={`/quiz/${quiz.id}`}
        //   >
        //     <h1 className="text-2xl">{quiz.quizCategory.category.name}</h1>
        //     {/* <img src={quiz.quizCategory.image} alt={quiz.quizCategory.category} className="w-64 h-64"/> */}
        //     <div className="h-32 w-32 md:h-64 md:w-64 bg-slate-600"></div>
        //     <div className="">
        //       <p className="text-2xl">
        //         Theme: {quiz.quizCategory.keywordPrompt.keyword}
        //       </p>
        //       <p className="text-2xl">Status: {quiz.status}</p>
        //       <p className="text-2xl">Points: {quiz.scoreAmt}</p>
        //     </div>
        //   </a>
        // );
      })}
    </div>
  );
};

export { PresentCategories };
