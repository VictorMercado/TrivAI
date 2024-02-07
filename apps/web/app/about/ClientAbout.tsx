'use client';
import { useStore } from "@src/store";
import { useState } from "react";
import { Button } from "@ui/button";

async function sendForm(obj : any) {
  let response : Response | undefined;
  try {
    response = await fetch("/api/feedBack", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(obj),
    });
  }
  catch (e : any) {
    console.log("this is the error", e);
    return new Error("Network Error", e);
  }
  return response?.ok
    ? response.json()
    : { message: new Error("Failed post request") };
}

// function shakeAnimation

export default function ClientAbout() {
    const [hasSubmit, setHasSubmit] = useState(false);
    const [error, setError] = useState(false);
    const [message, setMessage] = useState("");
    const submitForm = async (e : any) =>{
      e.preventDefault();
      setError(false);
      let form = e.target;
      
      const formData = new FormData(form);
      
      const formJson = Object.fromEntries(formData.entries());
      const response = await sendForm(formJson);
      console.log(response.message);
      
      if (response.message != "success") { 
        setError(true);
        return;
      }
      setMessage(response.feedback);
      setHasSubmit(true);
      e.target.reset();
    }

    return (
      <div className="my-4 flex flex-col items-center justify-center p-4 text-xl">
        <h1 className="m-4 text-2xl">Feed Back</h1>
        <form
          id="feedback"
          className={`
            m-4 flex flex-col gap-4
            ${hasSubmit && !error ? "border-4 border-green-400 p-4" : ""}
            ${error ? "border-4 border-red-400" : ""}
            `}
          onSubmit={submitForm}
        >
          <label className="flex flex-col items-center justify-between lg:flex-row">
            <span className="">Name:</span>
            <input
              className="peer ml-4 border border-primary bg-background p-2 caret-primary"
              type="text"
              name="name"
              disabled={false}
              placeholder="Dude Bro"
              required
            />
          </label>
          <label className="flex flex-col items-center justify-between lg:flex-row">
            <span>Email:</span>
            <input
              className="ml-4 resize border border-primary bg-background p-2 caret-primary"
              type="email"
              name="email"
              disabled={false}
              placeholder="hi123@live.com"
              required
            />
          </label>
          <label className="flex flex-col items-center justify-between lg:flex-row">
            <span>Message:</span>
            <textarea
              className="ml-4 max-h-32 min-h-[150px] min-w-[200px] max-w-lg resize border border-primary bg-background p-2 caret-primary"
              name="message"
              disabled={false}
              placeholder="This thing sucks..."
              maxLength={150}
              required
            />
          </label>
          <Button type="submit" variant="default" size="default">
            Submit
          </Button>
        </form>
        {message.length > 0 ? <p>Your Message: {message}</p> : <p></p>}
      </div>
    );
}