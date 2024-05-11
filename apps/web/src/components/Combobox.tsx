"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import Image from "next/image";
import { cn } from "@trivai/lib/utils";
import { Button } from "@components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@components/ui/command";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverTrigger,
} from "@components/ui/popover";

export type ProfilePicture = {
  name: string;
  image: string;
};

type ComboboxProps = {
  children?: React.ReactNode;
  value: ProfilePicture;
  setValue: ({ name, image }: ProfilePicture) => void;
  listItems: Array<ProfilePicture>;
};
const Combobox = ({ value, setValue, listItems, children }: ComboboxProps) => {
  const [open, setOpen] = React.useState(false);
  // const [value, setValue] = React.useState("");
  // const strippedValue = value.slice(1, value.length - 5);
  const screenH = typeof window !== "undefined" ? window.innerHeight : 0;
  let height = "h-[50vh]";
  if (screenH > 1500) {
    height = "h-[55vh]";
  }
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="default"
          role="combobox"
          aria-expanded={open}
          className="h-full justify-between"
        >
          {/* {strippedValue
            ? pokemon.find((pokemon) => pokemon.value === strippedValue)?.value
            : "Select Profic"} */}
          {value.name.split("-")[1] || value.name}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverAnchor className="absolute left-1/2"></PopoverAnchor>
      <PopoverContent
        className={`w-screen p-0 lg:w-[95vw] ${height} overflow-scroll md:overflow-hidden`}
      >
        {/* additional filtering */}
        {children}
        <Command>
          <CommandInput placeholder="Search profile pic on this page" />
          <CommandEmpty>No profile pic found.</CommandEmpty>
          <CommandGroup>
            <div className="grid grid-cols-2 lg:grid-cols-5">
              {listItems.map((item, _index) => (
                <CommandItem
                  key={item.name + _index}
                  onSelect={(currentValue) => {
                    setValue({
                      name: item.name,
                      image: item.image,
                    });
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value.name === item.name ? "opacity-100" : "opacity-0",
                    )}
                  />
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={24}
                    height={24}
                  />
                  <span className="ml-2">{item.name}</span>
                </CommandItem>
              ))}
            </div>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export { Combobox };
