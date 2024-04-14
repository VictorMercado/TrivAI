"use client";
import { useState, useEffect } from "react";
import { trpc } from "@t/client";
import { PopoverSelect } from "@ui/popover-select";
import { useRouter } from "next/navigation";
import { PopoverClose, PopoverContent } from "@ui/popover";
import { Input } from "@ui/input";
import { Button } from "@ui/button";
import { useSearchParams } from "next/navigation";
import { removeURL, replaceURL } from "@src/utils";
import { useSession } from "@trivai/auth/react";
import { Edit, X } from "lucide-react";
import type { GetAllCategories } from "@trivai/trpc/server/routers/AuthViewer/category/getAll.handler";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@ui/dialog";
import { useToast } from "@ui/toast";
import {
  Select,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@ui/select";
import { Tabs, TabsList, TabsTrigger } from "@ui/tabs";
import { Friend } from "@trivai/trpc/server/routers/AuthViewer/friend/getAll.handler";
import { TabsContent } from "@radix-ui/react-tabs";

type QuizGenControllerProps = {
  categories: GetAllCategories;
  friends: Array<Friend>;
};

const quizGen = {
  categories: ["FILMS", "SPACE", "CARS", "GAMES"],
  themes: {
    FILMS: ["Star Wars", "Harry Potter", "Lord of the Rings"],
    SPACE: ["Mars", "Moon", "Jupiter"],
    CARS: ["Ferrari", "Lamborghini", "Porsche"],
    GAMES: ["Chess", "Poker", "Monopoly"],
  },
};

const QuizGenController = ({ categories, friends }: QuizGenControllerProps) => {
  const { data: session } = useSession();
  const user = session?.user;
  const searchParams = useSearchParams();
  const utils = trpc.useUtils();
  const [textCategoryInput, setTextCategoryInput] = useState("");
  const [textThemeInput, setTextThemeInput] = useState("");
  const [generateCategoryInput, setGenerateCategoryInput] = useState("");
  const [generateThemeInput, setGenerateThemeInput] = useState("");
  
  const themes = categories.flatMap((category) => category.theme);
  const selectedCategory = searchParams?.get("category") || "";
  const selectedTheme = searchParams?.get("theme") || "";
  const [readyToDelete, setReadyToDelete] = useState(false);
  const { addToast } = useToast();
  const router = useRouter();
  const [assigneeId, setAssigneeId] = useState(
    friends.find((friend) => friend.id === user?.id)?.id,
  );

  if (!user) {
    return (
      <div>
        <h1>Not logged in</h1>
      </div>
    );
  }

  // these queries exist to refresh the data when a new category or theme is added
  const {
    data: categoriesData,
    error: categoriesError,
    isLoading: categoriesIsLoading,
  } = trpc.authViewer.category.getAll.useQuery(undefined, {
    initialData: categories,
  });
  const categoryIds = categoriesData.map((category) => category.id);
  const {
    data: themesData,
    error: themesError,
    isLoading: themesIsLoading,
  } = trpc.authViewer.theme.get.useQuery(
    { categoryIds },
    {
      initialData: themes,
    },
  );
  //

  const createCategory = trpc.authViewer.category.create.useMutation({
    onSuccess: async () => {
      await utils.authViewer.category.invalidate();
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
  const createTheme = trpc.authViewer.theme.create.useMutation({
    onSuccess: async () => {
      await utils.authViewer.theme.invalidate();
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
  const createQuiz = trpc.authViewer.quiz.create.useMutation({
    onSuccess: async (data) => {
      await utils.authViewer.quiz.invalidate();
      addToast({
        id: Math.random(),
        message: "Successfully created quiz: " + String(data.quiz.id),
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

  const deleteCategory = trpc.authViewer.category.delete.useMutation({
    onSuccess: async () => {
      await utils.authViewer.category.invalidate();
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
  const deleteTheme = trpc.authViewer.theme.delete.useMutation({
    onSuccess: async () => {
      await utils.authViewer.theme.invalidate();
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

  const handleCreateCategory = async (input: {
    name: string;
    userId: string;
  }) => {
    if (input.name === "") return;
    createCategory.mutate(input);
  };
  const handleCreateTheme = async (input: {
    name: string;
    categoryId: number;
  }) => {
    if (input.name === "") return;
    createTheme.mutate(input);
  };

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
    createQuiz.mutate(input);
    return createQuiz.data;
  };
  const handleDeleteCategory = async (input: {
    id: number;
    userId: string;
  }) => {
    deleteCategory.mutate(input);
  };
  const handleDeleteTheme = async (input: { id: number; userId: string }) => {
    deleteTheme.mutate(input);
  };

  const themeData = themesData.filter(
    (theme) => theme.category.name === selectedCategory,
  );
  const categoryData = categoriesData.find(
    (category) => category.name === selectedCategory,
  );
  // const categoryId = categoryData ? categoryData.id : undefined;
  // const themeId = themeData.find((theme) => theme.name === selectedTheme)?.id;
  return (
    <ul className="flex justify-between space-x-2 lg:flex-col lg:space-y-4">
      <li className="space-y-2 lg:m-auto lg:w-full">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full" variant="special" size="default">
              Generate
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Generate</DialogTitle>
            </DialogHeader>
            <DialogDescription>
              <p>
                Quickly generate a quiz based on your selected category and
                theme
              </p>
            </DialogDescription>
            <div className="flex flex-col gap-y-4">
              <div className="flex justify-between">
                <span>Category</span>
                <Tabs>
                  <TabsList>
                    <TabsTrigger value="input">Text input</TabsTrigger>
                    <TabsTrigger value="select">Select</TabsTrigger>
                  </TabsList>
                  <TabsContent value="input">
                    <Input
                      className="w-52"
                      placeholder="Enter Category"
                      defaultValue={selectedCategory}
                      value={generateCategoryInput || selectedCategory}
                      onChange={(e) => setGenerateCategoryInput(e.target.value)}
                    />
                  </TabsContent>
                  <TabsContent value="select">
                    <Select onValueChange={(e)=> {
                      setGenerateCategoryInput(e)
                    }}>
                      <SelectTrigger className="w-52">
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categoriesData.map((category) => (
                          <SelectItem key={category.id} value={category.name}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TabsContent>
                </Tabs>
              </div>
              <div className="flex justify-between">
                <span>Theme (Optional)</span>
                <Input
                  className="w-52"
                  placeholder="Enter Theme"
                  defaultValue={selectedTheme}
                  value={generateThemeInput || selectedTheme}
                  onChange={(e) => setGenerateThemeInput(e.target.value)}
                />
              </div>
              <div className="flex justify-between">
                <span>Assign</span>
                <Select
                  defaultValue={user.id}
                  onValueChange={(value) => {
                    setAssigneeId(value);
                  }}
                >
                  <SelectTrigger className="w-52">
                    <SelectValue placeholder="Friends" />
                  </SelectTrigger>
                  <SelectContent>
                    {friends.length > 0 &&
                      friends.map((friend) => (
                        <SelectItem key={friend.id} value={friend.id!}>
                          {friend.userName}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-between">
                <span>Date Due</span>
                <Input className="w-52" type="date" />
              </div>
              <div className="flex justify-center">
                <DialogClose asChild>
                  <Button
                    variant="default"
                    size="default"
                    onClick={() => {
                      handleCreateQuiz({
                        scoreAmt: 3,
                        ownerId: user.id,
                        assignId: assigneeId || user.id,
                        category: {
                          id: categoryData?.id!,
                          name: selectedCategory,
                        },
                        theme: {
                          id: themeData.find(
                            (theme) => theme.name === selectedTheme,
                          )?.id!,
                          name: selectedTheme,
                        },
                        questionLength: 10,
                      });
                    }}
                  >
                    Generate
                  </Button>
                </DialogClose>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        <Tabs defaultValue="Quizzes">
          <TabsList>
            <TabsTrigger
              value="Quizzes"
              onClick={() => {
                removeURL("moreOptions");
              }}
            >
              Quizzes
            </TabsTrigger>
            <TabsTrigger
              value="Create"
              onClick={() => {
                replaceURL("moreOptions", "true");
              }}
            >
              Options
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </li>
      <li className="flex flex-col space-y-2">
        <div>
          <PopoverSelect
            key={selectedCategory}
            label={"Category"}
            value={selectedCategory}
          >
            <PopoverContent
              className="rounded-none"
              align="start"
              onPointerDownOutside={() => {
                setReadyToDelete(false);
              }}
            >
              <div className="py-2">
                <div className="flex items-center justify-between">
                  <span>Category</span>
                  <div className="flex gap-1">
                    <Button
                      variant="default"
                      size="default"
                      onClick={() => {
                        removeURL("category");
                        removeURL("theme");
                      }}
                    >
                      Clear
                    </Button>
                    <Button
                      variant="default"
                      size="default"
                      className={`${readyToDelete ? "bg-primary text-black" : ""}`}
                      onClick={() => {
                        setReadyToDelete(!readyToDelete);
                      }}
                    >
                      <Edit />
                    </Button>
                  </div>
                </div>
              </div>
              <div className="-mx-1 my-1 h-px bg-primary" />
              {/* this is where the form will reside */}
              <ul className="flex min-h-10 flex-col justify-center">
                {categoriesData.map((category, _index) => (
                  <PopoverClose key={category.id} asChild>
                    <li
                      tabIndex={0}
                      onClick={(e) => {
                        if (!readyToDelete) {
                          replaceURL("category", category.name);
                          removeURL("theme");
                        } else {
                          e.stopPropagation();
                        }
                      }}
                      className="group m-0 rounded-none p-1 hover:bg-primary hover:text-black focus:bg-primary focus:text-black focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
                    >
                      <div className="flex w-full items-center justify-between">
                        <span className="">{category.name}</span>
                        {readyToDelete && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="default"
                                size="sm"
                                className="hover:border-black group-hover:border-black group-hover:text-black"
                                onClick={(e) => {
                                  e.stopPropagation();
                                }}
                              >
                                <X className="h-2 w-2" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Are you absolutely sure?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will
                                  permanently delete your category, linked
                                  themes and all your connected quizzes.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={(e) => {
                                    setReadyToDelete(false);
                                    removeURL("category");
                                    removeURL("theme");
                                    handleDeleteCategory({
                                      id: category.id,
                                      userId: user?.id,
                                    });
                                  }}
                                >
                                  Continue
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </div>
                    </li>
                  </PopoverClose>
                ))}
              </ul>
              <div className="-mx-1 my-1 h-px bg-primary" />
              <div className="mt-4 h-11">
                <form
                  className="flex h-full items-center gap-x-2"
                  action=""
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleCreateCategory({
                      name: textCategoryInput,
                      userId: user?.id,
                    });
                    setTextCategoryInput("");
                  }}
                >
                  <Input
                    className="group h-full max-w-48 rounded-none bg-primary/25 p-2 text-primary"
                    placeholder="Enter new Category"
                    value={textCategoryInput}
                    onChange={(e) => setTextCategoryInput(e.target.value)}
                  />
                  <PopoverClose asChild>
                    <Button
                      type="submit"
                      tabIndex={0}
                      size="default"
                      variant="default"
                      className="h-full rounded-none p-2"
                    >
                      Add Category
                    </Button>
                  </PopoverClose>
                </form>
              </div>
            </PopoverContent>
          </PopoverSelect>
        </div>
        <PopoverSelect key={selectedTheme} label="Theme" value={selectedTheme}>
          <PopoverContent
            className="rounded-none"
            align="start"
            onPointerDownOutside={() => {
              setReadyToDelete(false);
            }}
          >
            <div className="py-2">
              <div className="flex items-center justify-between">
                <span>Theme</span>
                <div className="flex gap-1">
                  <Button
                    variant="default"
                    size="default"
                    onClick={() => {
                      removeURL("theme");
                    }}
                  >
                    Clear
                  </Button>
                  <Button
                    variant="default"
                    size="default"
                    onClick={() => {
                      setReadyToDelete(!readyToDelete);
                    }}
                  >
                    <Edit />
                  </Button>
                </div>
              </div>
            </div>
            <div className="-mx-1 my-1 h-px bg-primary" />
            <ul className="flex min-h-10 flex-col justify-center">
              {themeData.length === 0 && (
                <li tabIndex={0} className="group m-0 rounded-none p-1">
                  <div className="flex w-full items-center justify-between">
                    <span className="">Select a category or add a theme</span>
                  </div>
                </li>
              )}
              {themeData.map((theme, _index) => (
                <PopoverClose key={theme.id} asChild>
                  <li
                    tabIndex={0}
                    onClick={(e) => {
                      if (!readyToDelete) {
                        replaceURL("theme", theme.name);
                      } else {
                        e.stopPropagation();
                      }
                    }}
                    className="group m-0 rounded-none p-1 hover:bg-primary hover:text-black focus:bg-primary focus:text-black focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
                  >
                    <div className="flex w-full items-center justify-between">
                      <span className="">{theme.name}</span>
                      {readyToDelete && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="default"
                              size="sm"
                              className="hover:border-black group-hover:border-black group-hover:text-black"
                              onClick={(e) => {
                                e.stopPropagation();
                              }}
                            >
                              <X className="h-2 w-2" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Are you absolutely sure?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will
                                permanently delete your theme and all your
                                connected theme quizzes.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => {
                                  setReadyToDelete(false);
                                  removeURL("theme");
                                  handleDeleteTheme({
                                    id: theme.id,
                                    userId: user?.id,
                                  });
                                }}
                              >
                                Continue
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>
                  </li>
                </PopoverClose>
              ))}
            </ul>
            <div className="-mx-1 my-1 h-px bg-primary" />
            <div className="flex flex-col">
              <div className="mt-4 flex">
                <Button variant="default" size="default">
                  Name
                </Button>
                <Button variant="default" size="default">
                  Days
                </Button>
                <Button variant="default" size="default">
                  Length
                </Button>
              </div>
              <div className="mt-4 ">
                <form
                  className="flex items-center space-x-2"
                  action=""
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (categoryData) {
                      handleCreateTheme({
                        name: textThemeInput,
                        categoryId: categoryData.id,
                      });
                      setTextThemeInput("");
                    } else {
                      addToast({
                        id: Math.random(),
                        message: "Choose a category first",
                        type: "error",
                      });
                    }
                  }}
                >
                  <Input
                    className="group flex-1 rounded-none bg-primary/25 p-2 text-primary focus:text-primary dark:focus-visible:ring-primary"
                    placeholder="Enter new theme"
                    value={textThemeInput}
                    onChange={(e) => setTextThemeInput(e.target.value)}
                  />
                  <PopoverClose asChild>
                    <Button
                      size="default"
                      variant="default"
                      onClick={() => {
                        if (categoryData) {
                          handleCreateTheme({
                            name: textThemeInput,
                            categoryId: categoryData.id,
                          });
                          setTextThemeInput("");
                        } else {
                          addToast({
                            id: Math.random(),
                            message: "Choose a category first",
                            type: "error",
                          });
                        }
                      }}
                      className="rounded-none p-2 focus:ring-primary dark:focus-visible:outline-none dark:focus-visible:ring-primary"
                    >
                      Add theme
                    </Button>
                  </PopoverClose>
                </form>
              </div>
            </div>
          </PopoverContent>
        </PopoverSelect>
      </li>
      <li>Friends</li>
    </ul>
  );
};

export { QuizGenController };
