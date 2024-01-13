"use client";
import Image from "next/image"
import { ColorPicker } from "@components/ColorPicker";
import { signOut, useSession } from "next-auth/react";
import { PokemonComboBox } from "./PokemonComboBox";
import { useState } from "react";
import { Button } from "@ui/button";
import { SVGSave2 } from "@ui/SVG";
import { useToast } from "@components/ui/toast";
import type { ProfilePicture } from '../page';
import { revalidatePath } from "next/cache";
import { useRouter } from "next/navigation";
import { stringExtractor } from "@/src/utils";

function rgbToHex(color: string) {
  let r = parseInt(color.split(" ")[0]);
  let g = parseInt(color.split(" ")[1]);
  let b = parseInt(color.split(" ")[2]);
  // Ensure that the RGB values are within the valid range (0-255)
  r = Math.max(0, Math.min(255, r));
  g = Math.max(0, Math.min(255, g));
  b = Math.max(0, Math.min(255, b));

  // Convert each decimal component to a hexadecimal value and pad with zeros if needed
  const hexR = r.toString(16).padStart(2, "0");
  const hexG = g.toString(16).padStart(2, "0");
  const hexB = b.toString(16).padStart(2, "0");

  // Combine the hexadecimal components to form the final hex color
  const hexColor = `#${hexR}${hexG}${hexB}`;

  return hexColor;
}

type SettingsFormProps = {
  profilePictures: Array<ProfilePicture>;
};
const SettingsForm = (props : SettingsFormProps) => {
  const router = useRouter();
  const { data: session, update } = useSession();
  const [userImage, setUserImage] = useState<ProfilePicture>({
    name:
      stringExtractor(session?.user.userImage?.split("/")[5]?.split("-")[1], '.png') ||
      "default",
    image: session?.user.userImage || "/default.png",
  });
  console.log(session?.user.userImage?.split("/")[5]?.split("-")[1]);
  
  console.log("this is session: ", session?.user.image);
  const [userName, setUserName] = useState<string>(
    session?.user.userName || "",
  );
  const { addToast } = useToast();

  const saveSettingsClick = async () => {
    const primaryColor =
      document.documentElement.style.getPropertyValue("--color-primary") ||
      "59 130 246";
    const secondaryColor =
      document.documentElement.style.getPropertyValue("--color-secondary") ||
      "255 255 255";
    try {
      const res = await fetch(`/api/user/${session?.user.userName}`, {
        method: "PATCH",
        body: JSON.stringify({
          id: session?.user.id,
          userName: userName,
          image: userImage.image,
          primaryColor: rgbToHex(primaryColor),
          secondaryColor: rgbToHex(secondaryColor),
        }),
      });
      if (!res.ok) {
        addToast({ id: Math.floor(Math.random() * 1000), message: "ERROR" });
        return;
      }
      const data = await res.json();
      // update the users session JWT
      update({ userName: userName, image: userImage.image });
      addToast({ id: Math.floor(Math.random() * 1000), message: "Success" });
    } catch (e) {
      addToast({ id: Math.floor(Math.random() * 1000), message: "ERROR" });
      console.error(e);
    }
    // need to refresh the page to see the changes in all routes
    router.refresh();
  };
  return (
    <div className="flex h-full flex-col space-y-10">
      {/* <h1 className="text-2xl">Your Score: {score}</h1> */}
      <form action="" className="flex flex-col space-y-6 text-xl lg:space-y-12">
        <label className="" htmlFor="userName">
          UserName:{" "}
        </label>
        <input
          className="border border-primary bg-background p-2 text-center"
          type="text"
          name="userName"
          id="userName"
          onChange={(e) => setUserName(e.target.value)}
          defaultValue={userName}
        />
        <label className="" htmlFor="userImage">
          User Image:
        </label>
        <div className="flex items-center justify-between">
          <div className="h-min">
            <PokemonComboBox
              value={userImage}
              setValue={setUserImage}
              profilePictures={props.profilePictures}
            />
          </div>
          <Image
            src={userImage.image}
            alt="User Image"
            width={100}
            height={100}
          />
        </div>
        <label className="" htmlFor="primaryColor">
          Choose Your Colors:{" "}
        </label>
        <div className="flex h-12 justify-between">
          <ColorPicker label="Primary" colorTheme="--color-primary" />
          <ColorPicker label="Secondary" colorTheme="--color-secondary" />
        </div>
        <Button
          className="group relative"
          variant="default"
          size="default"
          onClick={(e) => {
            e.preventDefault();
            saveSettingsClick();
          }}
        >
          <SVGSave2
            size={32}
            className="absolute left-24 group-hover:stroke-black"
          />
          <span className="">Save</span>
        </Button>
      </form>
    </div>
  );
};

export { SettingsForm };