import { CoolH1 } from "@/src/components/ui/cool-h1";

const CoolHeader = ({ routeLabel }: { routeLabel: string }) => {
  return (
    <>
      <div className="my-4 flex justify-center md:my-6">
        <CoolH1
          text={
            routeLabel[0].toUpperCase() + routeLabel.slice(1, routeLabel.length)
          }
        />
      </div>
    </>
  );
};

export { CoolHeader };
