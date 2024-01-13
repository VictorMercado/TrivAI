import Link from "next/link";
import { Button } from "@ui/button";

const QuizCompleted = () => {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-y-4">
        <h1 className="text-2xl">
          <b>You have completed this quiz!! 😊</b>
        </h1>
        <Link href="/results">
          <Button
            variant="default"
            size="default"
          >Go to Results</Button>
        </Link>
      </div>
    );
}

export { QuizCompleted }