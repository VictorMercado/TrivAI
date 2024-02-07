import { SelectModified } from "@ui/select-modified";
import { QuizGenController } from "@components/QuizGenController";

export default function Layout({ children }: { children: any; params: any }) {
  return (
    <div className="flex flex-1">
      <div className="w-48 border border-primary/25">
        <div className="p-4">
          
          <QuizGenController />
        </div>
      </div>
      {children}
    </div>
  );
}
