"use client";
import {
  SelectValue,
  SelectTrigger,
  SelectLabel,
  SelectItem,
  SelectGroup,
  SelectSeparator,
  SelectContent,
  Select,
} from "@ui/select";
import { Input } from "@ui/input";
import { Button } from "@ui/button";
import { useState, useEffect } from "react";

type SelectModifiedProps = {
  options: string[];
  label: string;
  onChange: (value: string) => void;
};

const SelectModified = ( {label, options, onChange} : SelectModifiedProps ) => {


  return (
    <div className="mx-auto w-full max-w-md">
      <Select onValueChange={(value) => onChange(value)}>
        <SelectTrigger className="w-full rounded-none bg-primary/25">
          <SelectValue placeholder={label} />
        </SelectTrigger>
        <SelectContent className="rounded-none border">
          <SelectGroup className="w-full">
            <SelectLabel className="text-primary">{label}</SelectLabel>
            {options.map((option, index) => {
              return (
                <SelectItem key={index} value={option} className="w-full">
                  {option}
                </SelectItem>
              );
            })}
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <div className="flex items-center space-x-2 p-2">
              <Input
                className="group flex-1 rounded-none dark:focus-visible:ring-primary"
                placeholder="Enter new option"
              />
              <Button size="default" variant="default">
                Add Option
              </Button>
            </div>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}

export { SelectModified }