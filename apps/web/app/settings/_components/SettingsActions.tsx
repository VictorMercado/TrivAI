"use client";
import { Button } from "@ui/button";
import { LetterModel } from "@/src/components/ui/letter-model";
import { useStore } from "@src/store";
import { signOut, } from "next-auth/react";

const SettingsActions = () => {
  const { totalScore, incrementScore, resetScore, deleteAccount } = useStore(
    (state) => state,
  );
  return (
    <div className="flex flex-col space-y-10">
      <Button
        aria-label="Reset score"
        title="this button might ruin your day :)"
        variant="danger"
        size="lg"
        onClick={() => {
          totalScore > 0 ? resetScore() : "";
        }}
      >
        THIS BUTTON IS DANGEROUS
      </Button>
      <LetterModel userSession={true} />
      <Button
        title="Delete account"
        aria-label="Delete account"
        variant="delete"
        size="lg"
        className=""
        onClick={() => {
          try {
            deleteAccount();
          } catch (e) {
            console.error(e);
          }
          signOut({ callbackUrl: `/` });
          alert("Successfully deleted account");
        }}
      >
        DELETE YOUR ACCOUNT NO GOING BACK
      </Button>
    </div>
  );
}

export { SettingsActions };