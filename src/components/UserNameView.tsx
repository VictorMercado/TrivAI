import { cn } from "@src/utils";

interface UserViewProps {
  role: string | undefined | null;
  name: string | undefined | null;
  className?: string;
}

const UserNameView = ({
  className,
  role,
  name,
}: UserViewProps) => {
  if (role) {
    return (
      <>
        ,
        <div className={cn("text-primary", className)}>
          <p className="text-2xl md:text-3xl">{name?.toUpperCase()}</p>
        </div>
      </>
    );
  }
  return null;
}

export { UserNameView };