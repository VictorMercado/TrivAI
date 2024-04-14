import {
  Popover,
  PopoverAnchor,
  PopoverTrigger,
  PopoverContent,
} from "@ui/popover";

import { ChevronDown } from "lucide-react";

type PopoverSelectProps = {
  label: string;
  value: string;
  children?: React.ReactNode;
};

export const PopoverSelect = ({
  label,
  value,
  children,
}: PopoverSelectProps) => {
  return (
    <Popover>
      <PopoverTrigger className="w-full border border-primary bg-primary/25 px-3 py-2 text-left text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background">
        <div className="flex items-center justify-between">
          <div className="text-primary">{value ? value : `${label}`}</div>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </div>
      </PopoverTrigger>
      {children}
    </Popover>
  );
};
