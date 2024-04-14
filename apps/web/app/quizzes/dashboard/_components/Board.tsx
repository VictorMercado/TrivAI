"use client";
import { Button } from "@ui/button";
// import { useQueryParams } from "@/src/hooks/useQueryParams";
import { useSearchParams } from "next/navigation";
import { useState, useRef, useEffect, ReactElement } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@ui/collapsible";
import { ChevronDown, RotateCcw, ArrowDown } from "lucide-react";
import { use } from "react";
import { trpc } from "@t/client";
import { QuizCard } from "@ui/quiz-card";
import type { GetAllCategories } from "@trivai/trpc/server/routers/AuthViewer/category/getAll.handler";
import { useRouter } from "next/navigation";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@ui/hover-card";
import { LoadQuizCards } from "@components/LoadQuizCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ui/tabs";
import { ChevronRight } from "lucide-react";
import { HorizontalScroll } from "@ui/horizontal-scroll";

type BoardProps = {
  categories: GetAllCategories;
  aiUrl: string;
};

const Board = ({ categories, aiUrl }: BoardProps) => {
  const router = useRouter();
  const utils = trpc.useUtils();
  const searchParams = useSearchParams();
  const moreOptions = searchParams?.get("moreOptions");
  const selectedCategory = searchParams?.get("category");
  const selectedTheme = searchParams?.get("theme");
  const categoryState = categories.find((category) => {
    return category.name === selectedCategory;
  }) 
  const themeState = categoryState?.theme.find((theme) => {
    return theme.name === selectedTheme;
  });

  return !moreOptions ? (
    <div className="container flex flex-col gap-y-4 p-2">
      <div className="flex items-center gap-x-2">
        <HoverCard>
          <HoverCardTrigger>
            <Button
              variant="default"
              size="sm"
              onClick={() => router.refresh()}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </HoverCardTrigger>
          <HoverCardContent>Refresh</HoverCardContent>
        </HoverCard>
        <h1 className="text-2xl">My Quizzes</h1>
      </div>
      <div className="flex flex-col gap-y-4 p-2">
        {selectedCategory && selectedTheme ? (
          <div className="w-full">
            <span className="flex items-center gap-x-2">
              <span>{categoryState?.name}</span>
              <ChevronRight className="h-4 w-4 text-primary" />
              <span>{themeState?.name}</span>
              <ArrowDown className="h-4 w-4 text-primary" />
            </span>
            {/* <div className="grid grid-cols-1 gap-4 p-4 lg:grid-cols-2"> */}
            <HorizontalScroll>
              {/* make scroll horizontall*/}
              {categoryState && themeState && (
                <LoadQuizCards
                  categoryId={categoryState.id}
                  themeId={themeState.id}
                />
              )}
            </HorizontalScroll>
            {/* </div> */}
          </div>
        ) : selectedCategory ? (
          <Collapsible defaultOpen={true}>
            <CollapsibleTrigger asChild>
              <div className="flex w-full justify-between border-b border-primary">
                <h2 className="text-xl">{categoryState?.name}</h2>
                <ChevronDown className="h-4 w-4" />
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="flex flex-col gap-y-4 border-l border-primary/25 p-6">
                {categoryState && (
                  <Tabs defaultValue="base">
                    <div className="flex justify-between">
                      <TabsList>
                        <TabsTrigger className="mr-4" value="base">
                          Base
                        </TabsTrigger>
                        {categoryState?.theme?.length > 0 &&
                          categoryState.theme.map((theme) => {
                            return (
                              <TabsTrigger
                                key={theme.id}
                                value={theme.name}
                              >
                                {theme.name}
                              </TabsTrigger>
                            );
                          })}
                      </TabsList>
                    </div>
                    <TabsContent value="base" className="p-4">
                      {/* <div className="grid grid-cols-2 gap-4"> */}
                      {/* make scroll horizontall*/}
                      <HorizontalScroll>
                        <LoadQuizCards categoryId={categoryState.id} />
                      </HorizontalScroll>
                      {/* </div> */}
                    </TabsContent>
                    {categoryState?.theme?.length > 0 &&
                      categoryState.theme.map((theme) => {
                        return (
                          <TabsContent
                            key={theme.id}
                            value={theme.name}
                            className="p-4"
                          >
                            <HorizontalScroll>
                              {/* make scroll horizontall*/}
                              <LoadQuizCards
                                categoryId={categoryState.id}
                                themeId={theme.id}
                              />
                            </HorizontalScroll>
                          </TabsContent>
                        );
                      })}
                  </Tabs>
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>
        ) : (
          categories.map((category) => {
            return (
              <Collapsible key={category.id}>
                <CollapsibleTrigger className="w-full text-left">
                  <div className="flex min-w-full justify-between border-b border-primary/50">
                    <h1 className="inline text-xl">{category.name}</h1>
                    <ChevronDown className="inline-block h-4 w-4" />
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="flex flex-col gap-y-4 border-l border-primary/25 p-6">
                    <Tabs defaultValue="base">
                      <div className="flex justify-between">
                        <TabsList>
                          <TabsTrigger className="mr-6" value="base">
                            Base
                          </TabsTrigger>
                          {category?.theme?.length > 0 &&
                            category.theme.map((theme) => {
                              return (
                                <TabsTrigger
                                  key={theme.id}
                                  value={theme.name}
                                >
                                  {theme.name}
                                </TabsTrigger>
                              );
                            })}
                        </TabsList>
                      </div>
                      <TabsContent value="base" className="p-4">
                        <HorizontalScroll>
                          {/* make scroll horizontall*/}
                          <LoadQuizCards categoryId={category.id} />
                        </HorizontalScroll>
                      </TabsContent>
                      {category?.theme?.length > 0 &&
                        category.theme.map((theme) => {
                          return (
                            <TabsContent
                              key={theme.id}
                              value={theme.name}
                              className="p-4"
                            >
                              <HorizontalScroll>
                                {/* make scroll horizontall*/}
                                <LoadQuizCards
                                  categoryId={category.id}
                                  themeId={theme.id}
                                />
                              </HorizontalScroll>
                            </TabsContent>
                          );
                        })}
                    </Tabs>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            );
          })
        )}
      </div>
    </div>
  ) : (
    <div className="p-2">
      <h1>More Options Coming Soon...</h1>
    </div>
  );
};

export { Board };
