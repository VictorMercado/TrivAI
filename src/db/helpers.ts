import type { AssignedQuizzes, UserQuizzes } from "@/app/results/page";

/**
 * @module db/helpers
 * This module contains helper functions for the database
 * @param quizzes an array of quizzes 
 * @returns mapped to an array of quiz ids
*/
export function getQuizIdsHelper(quizzes: any) {
  return quizzes?.map((quiz: any) => quiz.id);
}

// export type 

export type MergedUserAssignedQuiz = {
  id: number;
  scoreAmt: number;
  quizCategory: {
    image: string | null;
    keywordPrompt: {
      keyword: string;
    } | null;
    category: {
      name: string;
    };
  };
  status: string;
  userAnswers: {
    id: string;
    selectedAnswer: string;
    correctAnswer: boolean;
    createdAt: Date;
    updatedAt: Date;
    questionId: string;
    userId: string;
    userAnswerQuizId: string | null;
  }[];
};
// merge 2 arrays of objects based on a common schema
export const mergeQuizzes = (arr1: AssignedQuizzes, arr2: UserQuizzes): Array<MergedUserAssignedQuiz> => {
  if (!arr1) throw new Error("arr1 is undefined");
  if (!arr2) throw new Error("arr2 is undefined");
  return arr1.map((quiz, index) => {
    for (let i = 0; i < arr2.length; i++) {
      if (quiz!.id === arr2[i]!.quizId) {
        let status: string;
        if (arr2[i]!.completed) {
          status = "Completed";
        } else {
          status = "Incomplete";
        }
        return {
          ...quiz,
          status,
          userAnswers: arr2[i]!.userAnswers,
        };
      }
    }
    return {
      ...quiz,
      status: "Not Started",
      userAnswers: [],
    };
  });
};