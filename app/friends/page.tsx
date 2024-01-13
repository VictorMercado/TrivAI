import { SideBar } from "@components/SideBar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@ui/dropdown-menu";
import { MoreVertical } from "lucide-react";


interface Friend {
  id: number;
  name: string;
}

const friends: Friend[] = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
  { id: 3, name: "Charlie" },
];

export default function FriendsPage() {
  return (
    <main className="flex grow border border-red-500">
      <div className="grid w-full grid-cols-1 lg:grid-cols-4">
        <SideBar
          items={friends}
          renderItem={(friend) => (
            <div className="m-2 flex items-center justify-between gap-4">
              <div className="h-20 w-20 bg-gray-500">
                {/* <img src="" alt="" /> */}
              </div>
              {friend.name}
              <img src="/ho-oh.gif" alt="" width={50} height={50} />
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <MoreVertical />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem>Invite to Quiz</DropdownMenuItem>
                  <DropdownMenuItem>Send Quiz</DropdownMenuItem>
                  <DropdownMenuItem>Invite to Allegiance</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        />
        <div className="col-span-3 border border-blue-500"></div>
      </div>
    </main>
  );
}