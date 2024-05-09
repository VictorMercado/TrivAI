"use client";
import { Button } from "@ui/button";
import { removeURLParam, replaceURLParam, pushURLParam, getURL } from "@trivai/lib/utils";
import { useRouter } from "next/navigation";

type MultiplayerLobbyProps = {
  quizId: number;
  handleStart: (value : boolean) => void;
};

const MultiplayerLobby = ({ quizId, handleStart }: MultiplayerLobbyProps) => {
  const router = useRouter();
  return (
    <div>
      MultiplayerLobby {quizId}
      <Button variant="default" size="default" onClick={() => {
        handleStart(true);
      }}>Start</Button>
    </div>
  );
};

export { MultiplayerLobby };
