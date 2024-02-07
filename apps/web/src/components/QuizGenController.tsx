"use client";
import { useState, useEffect } from "react";
import { SelectModified } from "@ui/select-modified";

type QuizGenControllerProps = {};

type QuizConfig = {
  category: string;
  theme: string;

};

async function createCategory(category: string) {
  return await fetch("" );
}


const QuizGenController = () => {
  const [quizConfig, setQuizConfig] = useState();


  return (
    <ul className="space-y-4">
      <li>
        <SelectModified
          options={["Films", "Cars", "Games"]}
          label="Categories"
          onChange={(value) => console.log(value)}
        />
      </li>
      <li>
        <SelectModified
          options={["Scary", "SuperCars", "Nintendo"]}
          label="Themes"
          onChange={(value) => console.log(value)}
        />
      </li>
      <li>Themes</li>
      <li>Friends</li>
    </ul>
  );
}

export { QuizGenController };