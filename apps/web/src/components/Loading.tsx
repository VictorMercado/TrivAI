import { TrivaiLogo } from "./ui/trivai-logo";
const Loading = () => {
  return (
    <div className="flex h-[70vh] w-full animate-pulse items-center justify-center">
      <div className="coolBorder shadow-[0px_0px_75px_10px_rgb(var(--color-primary))] p-4">
        <TrivaiLogo />
      </div>
    </div>
  );
}

export { Loading };