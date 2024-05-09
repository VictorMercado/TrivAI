import Link from "next/link";
import { Button } from "@ui/button";
import { LineChart } from "lucide-react";

const QuizCompleted = () => {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-y-4">
        <h1 className="text-2xl">
          <b>You have completed this quiz!! 😊</b>
        </h1>
        <Link href="/results" className="flex items-center space-x-4">
          <span className="text-lg">Go to</span>
          <Button variant="default" size="default">
            <LineChart className="mx-2 h-6 w-6" />
            Results
          </Button>
        </Link>
      </div>
    );
}

export { QuizCompleted }