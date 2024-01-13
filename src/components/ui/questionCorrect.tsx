export const QuestionCorrect = ({correct} : {correct: boolean}) => {
    return (
      <>
        {correct ? (
          <div className="border-4 border-green-500 py-2 px-4"><b className="text-green-500">CORRECT</b></div>
        ) : (
          <div className="border-4 border-red-500 py-2 px-4 font-bold"><b className="text-red-500">INCORRECT</b></div>
        )}
      </>
    );

}