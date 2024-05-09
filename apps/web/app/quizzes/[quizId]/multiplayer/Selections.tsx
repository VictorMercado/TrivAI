"use client";
import { useOthers } from "@/liveblocks.config";
import { Selection } from "./Selection";

const Selections = ({ id }: { id: string }) => {
  const users = useOthers();

  return (
    <>
      {users.map(({ connectionId, presence }, index) => {
        if (presence.selectedId === id) {
          return (
            <Selection
              key={connectionId}
              name={presence.userName || "Anonymous"}
              color={presence.primaryColor || "white"}
              order={index}
            />
          );
        }
      })}
    </>
  );
}

export { Selections };