import { cn } from "@trivai/lib/utils";

type HorizontalScrollProps = {
  children: React.ReactNode;
  className?: string;
};

const HorizontalScroll = ({ children, className }: HorizontalScrollProps) => {
  return (
    <div className="w-full">
      <div
        className={cn(
          className,
          "hideScroll hideScroll2 flex gap-x-4 overflow-auto py-4",
        )}
      >
        {children}
        <div className="min-w-[100px]"></div>
      </div>
    </div>
  );
};

export { HorizontalScroll };
