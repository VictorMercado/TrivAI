import { Button } from "@ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function Layout({ children }: { children: any; params: any }) {
  return (
    <div className="flex flex-1 flex-col">
      {children}
    </div>
  );
}
