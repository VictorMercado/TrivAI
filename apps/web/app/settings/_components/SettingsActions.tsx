"use client";
import { Button } from "@ui/button";
import { LetterModel } from "@ui/letter-model";
import { useStore } from "@src/store";
import { signOut, } from "@trivai/auth/react";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@ui/alert-dialog";

const SettingsActions = () => {
  const router = useRouter();
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
          if (totalScore > 0) {
            resetScore();
            router.refresh();
          }
        }}
      >
        THIS BUTTON IS DANGEROUS
      </Button>
      <LetterModel userSession={true} />
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            aria-label="Delete account"
            title="Delete account"
            variant="delete"
            size="lg"
          >
            DELETE YOUR ACCOUNT NO GOING BACK
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete your account</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>
            Are you sure you want to delete your account? This action is
            irreversible.
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => {
                deleteAccount();
                signOut({ callbackUrl: `/` });
              }}
            >
              Delete account
            </AlertDialogAction>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export { SettingsActions };