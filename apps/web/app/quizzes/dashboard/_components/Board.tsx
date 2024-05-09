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
import type { GetAllCategories } from "@trivai/trpc/server/routers/AuthViewer/category/getAll.handler";
import { LoadQuizCardsByCategoryOrTheme } from "@components/LoadQuizCardsByCategoryOrTheme";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ui/tabs";
import { ChevronRight, createLucideIcon, Plus } from "lucide-react";
import { HorizontalScroll } from "@ui/horizontal-scroll";
import { useToast } from "@ui/toast";
import { trpc } from "@t/client";
import { useRouter } from "next/navigation";
import { useSession } from "@trivai/auth/react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@ui/hover-card";

type BoardProps = {
  categories: GetAllCategories;
  aiUrl: string;
};

const ScrollPlus = createLucideIcon("Scroll", [
  [
    "path",
    {
      d: "M8 21h12a2 2 0 0 0 2-2v-2H10v2a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v3h4",
      key: "13a6an",
    },
  ],
  ["path", { d: "M19 17V5a2 2 0 0 0-2-2H4", key: "zz82l3" }],
]);

const Board = ({ categories, aiUrl }: BoardProps) => {
  const { data } = useSession();
  const user = data?.user;
  const router = useRouter();
  const utils = trpc.useUtils();
  const {addToast} = useToast();
  const searchParams = useSearchParams();
  const moreOptions = searchParams?.get("moreOptions");
  const selectedCategory = searchParams?.get("category");
  const selectedTheme = searchParams?.get("theme");
  const [refresh, setRefresh] = useState(true);
  const [clickedTheme, setClickedTheme] = useState<{name: string, id:number} | undefined>(undefined);
  const categoryState = categories.find((category) => {
    return category.name === selectedCategory;
  }) 
  const themeState = categoryState?.theme.find((theme) => {
    return theme.name === selectedTheme;
  });
  const createQuiz = trpc.authViewer.quiz.create.useMutation({
    onSuccess: async (data) => {
      await utils.authViewer.quiz.invalidate();
      addToast({
        id: Math.random(),
        message: "Successfully initialized quiz: " + String(data.quiz.id),
        type: "success",
      });
      router.refresh();
    },
    onError: (error) => {
      addToast({
        id: Math.random(),
        message: error.message,
        type: "error",
      });
    },
  });
  const handleCreateQuiz = async (input: {
    year?: number;
    month?: number;
    day?: number;
    scoreAmt: number;
    ownerId: string;
    assignId: string;
    category: {
      id: number;
      name: string;
    };
    theme?: {
      id: number;
      name: string;
    };
    userDescription?: string;
    questionLength?: number;
    questionType?: string;
  }) => {
    if (input?.theme?.id === -1 || input.category.id === -1) {
      await utils.authViewer.category.invalidate();
      await utils.authViewer.theme.invalidate();
    }
    createQuiz.mutate(input);
    return createQuiz.data;
  };
  return !moreOptions ? (
    <div className="container flex flex-col gap-y-4 p-2">
      <div className="flex items-center gap-x-2">
        <HoverCard>
          <HoverCardTrigger>
            <Button
              variant="default"
              size="sm"
              onClick={() => {
                setRefresh(false);
                setTimeout(() => {
                  setRefresh(true);
                }, 200);
              }}
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
            <div className="flex justify-between">
              <span className="flex items-center gap-x-2">
                <span>{categoryState?.name}</span>
                <ChevronRight className="h-4 w-4 text-primary" />
                <span>{themeState?.name}</span>
                <ArrowDown className="h-4 w-4 text-primary" />
              </span>
              {categoryState && themeState && (
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <Button
                      variant="default"
                      size="sm"
                      className="px-2 py-2"
                      onClick={() => {
                        handleCreateQuiz({
                          scoreAmt: 3,
                          ownerId: user!.id,
                          assignId: user!.id,
                          category: {
                            id: categoryState.id,
                            name: categoryState.name,
                          },
                          theme: {
                            id: themeState.id,
                            name: themeState.name,
                          },
                          questionLength: 10,
                        });
                      }}
                    >
                      <Plus className="h-4 w-4"></Plus>
                    </Button>
                  </HoverCardTrigger>
                  <HoverCardContent>Create Quiz</HoverCardContent>
                </HoverCard>
              )}
            </div>
            {/* <div className="grid grid-cols-1 gap-4 p-4 lg:grid-cols-2"> */}
            <HorizontalScroll>
              {/* make scroll horizontall*/}
              {categoryState && themeState && refresh && (
                <LoadQuizCardsByCategoryOrTheme
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
                        <TabsTrigger
                          className="mr-4"
                          value="base"
                          onClick={() => {
                            setClickedTheme(undefined);
                          }}
                        >
                          Base
                        </TabsTrigger>
                        {categoryState?.theme?.length > 0 &&
                          categoryState.theme.map((theme) => {
                            return (
                              <TabsTrigger
                                key={theme.id}
                                value={theme.name}
                                onClick={() => {
                                  setClickedTheme({
                                    name: theme.name,
                                    id: theme.id,
                                  });
                                }}
                              >
                                {theme.name}
                              </TabsTrigger>
                            );
                          })}
                      </TabsList>
                      <HoverCard>
                        <HoverCardTrigger asChild>
                          <Button
                            variant="default"
                            size="sm"
                            className="px-2 py-2"
                            onClick={() => {
                              const quizObject = clickedTheme
                                ? {
                                    scoreAmt: 3,
                                    ownerId: user!.id,
                                    assignId: user!.id,
                                    category: {
                                      id: categoryState.id,
                                      name: categoryState.name,
                                    },
                                    theme: categoryState.theme.some(
                                      (theme) => clickedTheme.id === theme.id,
                                    )
                                      ? {
                                          id: clickedTheme.id,
                                          name: clickedTheme.name,
                                        }
                                      : undefined,
                                    questionLength: 10,
                                  }
                                : {
                                    scoreAmt: 3,
                                    ownerId: user!.id,
                                    assignId: user!.id,
                                    category: {
                                      id: categoryState.id,
                                      name: categoryState.name,
                                    },
                                    questionLength: 10,
                                  };
                              handleCreateQuiz(quizObject);
                            }}
                          >
                            <Plus className="h-4 w-4"></Plus>
                          </Button>
                        </HoverCardTrigger>
                        <HoverCardContent>Create Quiz</HoverCardContent>
                      </HoverCard>
                    </div>
                    <TabsContent value="base" className="p-4">
                      {/* <div className="grid grid-cols-2 gap-4"> */}
                      {/* make scroll horizontall*/}
                      <HorizontalScroll>
                        {refresh && (
                          <LoadQuizCardsByCategoryOrTheme
                            categoryId={categoryState.id}
                          />
                        )}
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
                              {refresh && (
                                <LoadQuizCardsByCategoryOrTheme
                                  categoryId={categoryState.id}
                                  themeId={theme.id}
                                />
                              )}
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
                          <TabsTrigger
                            className="mr-6"
                            value="base"
                            onClick={() => {
                              setClickedTheme(undefined);
                            }}
                          >
                            Base
                          </TabsTrigger>
                          {category?.theme?.length > 0 &&
                            category.theme.map((theme) => {
                              return (
                                <TabsTrigger
                                  key={theme.id}
                                  value={theme.name}
                                  onClick={() => {
                                    setClickedTheme({
                                      name: theme.name,
                                      id: theme.id,
                                    });
                                  }}
                                >
                                  {theme.name}
                                </TabsTrigger>
                              );
                            })}
                        </TabsList>
                        <HoverCard>
                          <HoverCardTrigger asChild>
                            <Button
                              variant="default"
                              size="sm"
                              className="px-2 py-2"
                              onClick={() => {
                                const quizObject = clickedTheme
                                  ? {
                                      scoreAmt: 3,
                                      ownerId: user!.id,
                                      assignId: user!.id,
                                      category: {
                                        id: category.id,
                                        name: category.name,
                                      },
                                      theme: category.theme.some(
                                        (theme) => clickedTheme.id === theme.id,
                                      )
                                        ? {
                                            id: clickedTheme.id,
                                            name: clickedTheme.name,
                                          }
                                        : undefined,
                                      questionLength: 10,
                                    }
                                  : {
                                      scoreAmt: 3,
                                      ownerId: user!.id,
                                      assignId: user!.id,
                                      category: {
                                        id: category.id,
                                        name: category.name,
                                      },
                                      questionLength: 10,
                                    };
                                handleCreateQuiz(quizObject);
                              }}
                            >
                              <Plus className="h-4 w-4"></Plus>
                            </Button>
                          </HoverCardTrigger>
                          <HoverCardContent>Create Quiz</HoverCardContent>
                        </HoverCard>
                      </div>
                      <TabsContent value="base" className="p-4">
                        <HorizontalScroll>
                          {/* make scroll horizontall*/}
                          {refresh && (
                            <LoadQuizCardsByCategoryOrTheme
                              categoryId={category.id}
                            />
                          )}
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
                                {refresh && (
                                  <LoadQuizCardsByCategoryOrTheme
                                    categoryId={category.id}
                                    themeId={theme.id}
                                  />
                                )}
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
