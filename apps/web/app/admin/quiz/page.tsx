import AddQuizQuestion from "@components/AddQuizQuestion";
import { prisma } from "@trivai/prisma";
import { Table } from "@components/Table";

async function getKeywords() {
  return await prisma.keywordPrompt.findMany();
}
async function getQuizCategories() {
  return await prisma.quizCategory.findMany();
}
async function getQuestions() {
  return await prisma.question.findMany();
}

export default async function AdminQuizPage() {
  const [keywords, categories, questions] = await Promise.all([
    getKeywords(),
    getQuizCategories(),
    getQuestions(),
  ]);
  const keywordHead = ["ID", "Keyword", "Category", "Used"];
  const categoryHead = [
    "ID",
    "Category",
    "GPT Base Prompt",
    "Stable Diffusion Prompt",
    "Created At",
    "Active",
  ];
  const questionHead = [
    "ID",
    "Category",
    "Is Used",
    "Answer1",
    "Answer2",
    "Answer3",
    "Correct Answer",
    "Created At",
    "Updated At",
    "Date Due",
    "Image",
  ];
  return (
    <div className="flex flex-col space-y-12">
      <div className="grid grid-cols-1 justify-center">
        <Table title="Keywords" data={keywords} thead={keywordHead} />
        <Table title="Categories" data={categories} thead={categoryHead} />
        <Table title="Questions" data={questions} thead={questionHead} />
      </div>
      {/* <QuizQuestion /> */}
    </div>
  );
}
