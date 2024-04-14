'use client';
import { useStore } from "@src/store";
import { useState } from "react";
import { Button } from "@ui/button";
import { Input } from "@ui/input";
import { Textarea } from "@ui/textarea";

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
          <label className="flex flex-col items-center justify-between gap-x-4 lg:flex-row">
            <span className="">Name:</span>
            <Input
              className="min-w-[200px] max-w-60"
              type="text"
              name="name"
              disabled={false}
              placeholder="Dude Bro"
              required
            />
          </label>
          <label className="flex flex-col items-center justify-between gap-x-4 lg:flex-row">
            <span>Email:</span>
            <Input
              className="min-w-[200px] max-w-60"
              type="email"
              name="email"
              disabled={false}
              placeholder="hi123@live.com"
              required
            />
          </label>
          <label className="flex flex-col items-center justify-between gap-x-2 lg:flex-row">
            <span>Message:</span>
            <Textarea
              className="max-h-40 min-w-60 max-w-80 resize"
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