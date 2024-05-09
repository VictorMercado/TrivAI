"use client";

import { ReactNode } from "react";
import { RoomProvider } from "@/liveblocks.config";
import { ClientSideSuspense } from "@liveblocks/react";
import { useSession } from "@trivai/auth/react";
import { UserState } from "@trivai/lib/server/queries/user";

type RoomProps = {
  roomId: string;
  user: UserState;
  children: ReactNode;
};

export function Room({ user, roomId, children }: RoomProps) {
  // const primaryColor = session?.data?.user.primaryColor;
  const isHost = user.id === roomId.split("_")[0];
  return (
    <RoomProvider id={roomId} initialPresence={{
      host: isHost,
      cursor: { x: 0, y: 0, ratioX: 0, ratioY: 0 },
      primaryColor: user.primaryColor as string,
      hoveredElement: null,
      selectedId: null,
      userName: user.userName,
      userId: user.id,
      selectedAnswer: null,
      correct: null,
      hostData: {
        currentQuestionId: null,
        allAnswersCorrect: null,
        correctAnswer: null,
        everyoneHasAnswered: null,
        everyoneSlice: null,
        everyoneLoad: null,
        othersAnswers: null,
      },
    }}>
      <ClientSideSuspense fallback={<div>Loading…</div>}>
        {() => children}
      </ClientSideSuspense>
    </RoomProvider>
  );
}
