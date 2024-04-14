"use client";
import { getBaseUrl } from "@/src/utils";
import { useToast } from "@/src/components/ui/toast";
import { useEffect } from "react";

async function Set_Cookie() {
  let response;
  try {
    response = await fetch(getBaseUrl() + "/api/setCookie", {
      method: "GET",
      credentials: "include",
    });
  } catch (e) {
    console.log("Network Fetch failed report to Victor");
    console.log(e);
  }
  return response;
}

const SetCookie = () => {
  const { addToast } = useToast();
  useEffect(() => {
    Set_Cookie().then((response) => {
      if (!response?.ok) {
        addToast({
          id: Math.random(),
          message: "Failed to set cookie, report to Victor",
          type: "error",
        });
      }
    });
  }, []);
  return null;
}

export { SetCookie };