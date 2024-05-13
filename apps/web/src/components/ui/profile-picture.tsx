import Image from "next/image";

type ProfilePictureProps = {
  size?: number;
  image: string;
};

const ProfilePicture = ({ image, size = 36 }: ProfilePictureProps) => {
  return (
    <div className="flex items-center justify-center">
      <Image
        unoptimized
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
