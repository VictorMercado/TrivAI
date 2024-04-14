import type { TUserAnsweredQuizzesWithAnswers, TUserAnsweredQuizzesWithoutAnswers } from "@trivai/lib/server/queries/quiz";
import type { TQuizView } from "@trivai/lib/server/queries/quiz";
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
  image: string | null;
  quizCategory: {
    theme: {
      name: string;
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
    userAnsweredQuizId: string | null;
  }[];
};

// TODO: load arr2 into a map for faster lookup
// Provide assigned quizzes arg1 and userAnsweredQuizzes arg2
// This function will merge the two arrays and return an array of merged quizzes with status 
// and answers to be used when showing results of a quiz
export const mergeQuizzesWithAnswers = (arr1: any, arr2: TUserAnsweredQuizzesWithAnswers): Array<MergedUserAssignedQuiz> => {
  if (!arr1) throw new Error("arr1 is undefined");
  if (!arr2) throw new Error("arr2 is undefined");
  return arr1.map((quiz: any, index: any) => {
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

// TODO: load arr2 into a map for faster lookup
// Provide assigned quizzes arg1 and userAnsweredQuizzes arg2
// This function will merge the two arrays and return an array of merged quizzes with status
// no answers because this will be used only for displaying quizzes
export const mergeQuizzesView = (arr1: any, arr2: TUserAnsweredQuizzesWithoutAnswers): Array<TQuizView> => {
  if (!arr1) throw new Error("arr1 is undefined");
  if (!arr2) throw new Error("arr2 is undefined");
  return arr1.map((quiz: any, index: any) => {
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
        };
      }
    }
    return {
      ...quiz,
      status: "Not Started",
    };
  });
};


export const mergeQuizzesByQuizIdAndAssigneeId = (arr1: any, arr2: Array<TUserAnsweredQuizzesWithoutAnswers[0] & { assigneeId: string; }> ): Array<TQuizView> => {
  if (!arr1) throw new Error("arr1 is undefined");
  if (!arr2) throw new Error("arr2 is undefined");
  return arr1.map((quiz: any, index: any) => {
    for (let i = 0; i < arr2.length; i++) {
      if (quiz!.quiz.id === arr2[i]!.quizId && quiz!.assigneeId === arr2[i]!.assigneeId) {
        let status: string;
        if (arr2[i]!.completed) {
          status = "Completed";
        } else {
          status = "Incomplete";
        }
        return {
          ...quiz.quiz,
          status,
        };
      }
    }
    return {
      ...quiz.quiz,
      status: "Not Started",
    };
  });
}



