"use client";
import { Button } from "@ui/button";
import Image from "next/image";
import { Dialog, DialogContent, DialogTrigger, DialogClose } from "@ui/dialog";
import { Textarea } from "@ui/textarea";
import { useState } from "react";
import { useSession } from "@trivai/auth/react";

type ErrorPageProps = {
  error: Error;
  reset: () => void;
};

const ErrorPage = ({ error, reset }: ErrorPageProps) => {
  const [report, setReport] = useState("");
  const { data: session } = useSession();

  const handleReport = () => {
    try {
      fetch("/api/feedBack", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: session?.user?.name,
          message: report,
        }),
      });
    } catch (e) {
      alert(
        "Welp, I guess now we really have a problem. How about refresh the page.",
      );
    }
  };

  return (
    <div className="h-[60vh] p-4 md:flex-1">
      <div className="flex size-full flex-col items-center justify-center gap-y-10">
        <div className="flex">
          <div className="relative md:mt-12">
            <div className="absolute right-[-5px] top-[70px] h-6 w-16 rounded-lg border border-textBase"></div>
            <div className="absolute right-[-20px] top-[100px] h-4 w-8 rounded-md border border-textBase"></div>
            <div className="rounded-lg border border-textBase p-4">
              What the heck is this? An error?{" "}
            </div>
          </div>
          <Image
            unoptimized
            src="/pikaerror.png"
            width={300}
            height={300}
            className=""
            alt="Error Image"
          />
        </div>
        <div>
          <p>
            Oops, you discovered an edge case that Victor did not account for,{" "}
          </p>
          <p>feel free to report this with the left button down below.</p>
          <p>Or refresh the page with the button on the right.</p>
        </div>
        <div className="flex gap-x-6">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="default" size="default">
                Report
              </Button>
            </DialogTrigger>
            <DialogContent>
              <div className="text-center">Report the error</div>
              <Textarea
                maxLength={350}
                className="max-h-[50vh]"
                value={report}
                onChange={(e) => {
                  setReport(e.target.value);
                }}
              />
              <DialogClose asChild>
                <Button
                  variant="default"
                  size="default"
                  onClick={() => {
                    report.length > 0
                      ? handleReport()
                      : alert("Please enter a message");
                  }}
                >
                  Submit
                </Button>
              </DialogClose>
            </DialogContent>
          </Dialog>
          <Button
            variant="default"
            size="default"
            onClick={() => {
              reset();
            }}
          >
            Refresh
          </Button>
        </div>
      </div>
    </div>
  );
}

export { ErrorPage };