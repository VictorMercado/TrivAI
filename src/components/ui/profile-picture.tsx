import { getCurrentUser } from "@/src/session";
import { Session } from "next-auth";
import Image from "next/image";

type ProfilePictureProps = {
  size?: number;
  image: string;
};

const ProfilePicture = ({ image, size = 50 }: ProfilePictureProps) => {
  return (
    <div className="flex items-center justify-center">
      <Image
        src={image}
        alt="Profile Picture"
        className={``}
        width={size}
        height={size}
      />
    </div>
  );
};

export { ProfilePicture };
