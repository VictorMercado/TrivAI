const { faker } = require('@faker-js/faker');
const { PrismaClient } = require('@prisma/client');
const fs = require('node:fs');
const prisma = new PrismaClient();

// Function to generate a random date within a range
function getRandomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// Function to generate the user data
function createUsers() {
  const users = [];

  for (let i = 0; i < 10; i++) {
    const user = {
      name: faker.person.fullName(),
      userName: faker.internet.userName(),
      email: faker.internet.email(),
      emailVerified: getRandomDate(new Date(2020, 0, 1), new Date()),
      image: faker.image.avatar(),
      role: 'USER',
      cheatUsed: faker.datatype.boolean(),
      cheatUsedAt: getRandomDate(new Date(2021, 0, 1), new Date()),
      createdAt: new Date(),
      totalScore: faker.number.int({ min: 0, max: 100 }),
    };

    users.push(user);
  }

  return users;
}

async function loadUsers(data) {

  try {
    const createdUsers = await prisma.user.createMany({
      data: data,
      skipDuplicates: true,
    });
    console.log(`Seeded ${createdUsers.count} new users.`);
  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
}

  // CARS
  // POKEMON
  // GENERAL
  // SPORTS
  // HISTORY
  // GEOGRAPHY
  // ENTERTAINMENT
  // SCIENCE
  // ART
  // MUSIC
  // FILMS
  // LITERATURE
  // MATHS
  // TECHNOLOGY
  // ANIMALS
  // VEHICLES
  // FOOD
  // NATURE
  // TRAVEL
  // POLITICS
  // CELEBRITIES
  // COMICS
  // GAMES
  // ANIME
  // CARTOONS

function createCategories() {
  let categories = [];
  const categoryNames = ["FILMS", "GEOGRAPHY", "CARS", "GAMES"];
  for (let i = 0; i < categoryNames.length; i++) {
    const category = {
      name: categoryNames[i],
      createdAt: new Date(),
    };
    categories.push(category);
  }
  return categories;
}

async function loadCategories(data) {
  await prisma.$queryRaw`ALTER TABLE Category AUTO_INCREMENT = 1`;
  try {
    const createdCategories = await prisma.category.createMany({
      data: data,
      skipDuplicates: true,
    });
    console.log(`Seeded ${createdCategories.count} new categories.`);
  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
}

async function createKeywordPrompts() {
  let keywordPrompts = [];
  let keywords = ["Halloween","American States", "Super", "Nintendo"];
  const categories = await prisma.category.findMany({
    select: {
      id: true,
    }
  });
  for (let i = 0; i < categories.length; i++) {
    const keyword = {
      keyword: keywords[i],
      categoryId: categories[i].id,
    };
    keywordPrompts.push(keyword);
  }
  return keywordPrompts;
}

async function loadKeywords(data) {
  await prisma.$queryRaw`ALTER TABLE KeywordPrompt AUTO_INCREMENT = 1`;
  try {
    const createdKeywords = await prisma.keywordPrompt.createMany({
      data: data,
      skipDuplicates: true,
    });
    console.log(`Seeded ${createdKeywords.count} new keyword prompts.`);
  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
}

let quizCategoryShape = {
  basePrompt: "",
  sdPrompt: "",
  categoryId: 0,
  quiz: {
    create: [

    ]
  }
}
let quizShape = {

}

async function createQuizCategories() {
  const quizCategories = [];

  const categories = await prisma.category.findMany({
    select: {
      id: true,
      name: true,
    }
  });
  const keywords = await prisma.keywordPrompt.findMany({
    select: {
      id: true,
      categoryId: true,
    }
  });
  // TODO:: create an intersection of the two arrays to match the correct category id with 
  for (let i = 0; i < categories.length; i++) {
    const quizCategory = {
      basePrompt: `70 _ ${(categories[i].name.toLowerCase())}`,
      sdPrompt: `an image of ${(categories[i].name.toLowerCase())}`,
      categoryId: keywords[i].id,
      keywordPromptId: keywords[i].id,
    };

    quizCategories.push(quizCategory);
  }

  return quizCategories;
}


async function loadQuizCategories(data) {
  await prisma.$queryRaw`ALTER TABLE QuizCategory AUTO_INCREMENT = 1`;
  try {
    const createdCategories = await prisma.quizCategory.createMany({
      data: data,
      skipDuplicates: true,
    });
    console.log(`Seeded ${createdCategories.count} new quiz categories.`);
  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
}

async function createYearMonthWeekDays() {
  await prisma.$queryRaw`ALTER TABLE Year AUTO_INCREMENT = 1`;
  const year = await prisma.year.create({
    data: {
      year: 2023,
    }
  });
  await prisma.$queryRaw`ALTER TABLE Month AUTO_INCREMENT = 1`;
  let months = await prisma.month.createMany({
    data: [
      {
        month: 1,
        yearId: year.id,
      },
      {
        month: 2,
        yearId: year.id,
      },
      {
        month: 3,
        yearId: year.id,
      },
    ]
  });
  months = await prisma.month.findMany();
  await prisma.$queryRaw`ALTER TABLE Week AUTO_INCREMENT = 1`;
  let weeks = await prisma.week.createMany({
    data: [
      {
        week: 1,
        monthId: months[0].id,
      },
      {
        week: 2,
        monthId: months[0].id,
      },
      {
        week: 3,
        monthId: months[0].id,
      },
      {
        week: 4,
        monthId: months[0].id,
      },
      {
        week: 1,
        monthId: months[1].id,
      },
      {
        week: 2,
        monthId: months[1].id,
      },
      {
        week: 3,
        monthId: months[1].id,
      },
      {
        week: 4,
        monthId: months[1].id,
      },
      {
        week: 1,
        monthId: months[2].id,
      },
      {
        week: 2,
        monthId: months[2].id,
      },
      {
        week: 3,
        monthId: months[2].id,
      },
      {
        week: 4,
        monthId: months[2].id,
      },
    ]});
    weeks = await prisma.week.findMany();
    await prisma.$queryRaw`ALTER TABLE Day AUTO_INCREMENT = 1`;
    for(const week of weeks) {
      for (let i = 0; i < 7; i++) {
        await prisma.day.create({
          data: {
            day: i + 1,
            weekId: week.id,
          }
        });
      }
    }
}

// and create QUIZ here too
async function createQuiz() {
  let allQuestions = [];
  let quizQuestions = [];
  await prisma.quiz.deleteMany();
  await prisma.$queryRaw`ALTER TABLE Quiz AUTO_INCREMENT = 1`;
  
  const quizCategories = await prisma.quizCategory.findMany();
  const days = await prisma.day.findMany();

  for (const day of days) {
    for (const quizCategory of quizCategories) {
      const quiz = await prisma.quiz.create({
        data: {
          dateDue: (new Date((new Date()).setUTCHours(0,0,0,0))).toISOString(),
          // quizCategoryId: quizCategory.id,
          quizCategory : {
            connect: {
              id: quizCategory.id
            }
          },
          day: {
            connect: {
              id: day.id
            }
          }
        },
        select: {
          id: true,
          quizCategoryId: true,
        }
      });
      console.log(quiz);
      for (let i = 0; i < 10; i++) {
        quizQuestions.push({
          isUsed: false,
          answer1: "answer 1",
          answer2: "answer 2",
          answer3: "answer 3",
          correctAnswer: "correct Answer",
          image: "https://storage.googleapis.com/trivai-images/5-19-2023/ANIMALS/grid-0040.png",
        });
      }
      await prisma.quiz.update({
        where: {
          id: quiz.id,
        },
        data: {
          questions: {
            create: quizQuestions,
          }
        }
      });
      quizQuestions.splice(0, quizQuestions.length);
    }
  }
  return allQuestions;
}

// async function loadQuestions(data) {
//   try {
//     const createdQuestions = await prisma.question.createMany({
//       data: data,
//     });
//     console.log(`Seeded ${createdQuestions.count} new questions.`);
//   } catch (err) {
//     console.error(err);
//   } finally {
//     await prisma.$disconnect();
//   }
// }


async function dumpJSON() {
  const users = await prisma.user.findMany();
  const categories = await prisma.quizCategory.findMany();
  const questions = await prisma.question.findMany();
  const keyword = await prisma.keywordPrompt.findMany();
  const userAnswers = await prisma.userAnswers.findMany();

  const data = {
    users,
    categories,
    questions,
    keyword,
    userAnswers,
  };

  fs.appendFile('data.json', JSON.stringify(data, null, 2), (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log('Data written to file');
    }
  });
  await prisma.$disconnect();
}

async function main() {
  const deleteYears = await prisma.year.deleteMany();
  console.log(`Deleted ${deleteYears.count} years.`);
  // Call the function to generate the user data
  const deletedQuestions = await prisma.question.deleteMany();
  console.log(`Deleted ${deletedQuestions.count} old questions.`);
  const deletedQuizzes = await prisma.quiz.deleteMany();
  console.log(`Deleted ${deletedQuizzes.count} old quizzes.`);
  const deletedQuizCategories = await prisma.quizCategory.deleteMany();
  console.log(`Deleted ${deletedQuizCategories.count} old quiz categories.`);

  const deletedKeywords = await prisma.keywordPrompt.deleteMany();
  console.log(`Deleted ${deletedKeywords.count} old keyword prompts.`);

  const deletedCategories = await prisma.category.deleteMany();
  console.log(`Deleted ${deletedCategories.count} old categories.`);

  const deletedUsers = await prisma.user.deleteMany({
    where: {
        email: {
            not: 'zenprod123@gmail.com'
        }
    },
  });
  console.log(`Deleted ${deletedUsers.count} old users.`);

  const seedUserData = createUsers();
  await loadUsers(seedUserData);

  const categories = createCategories();
  await loadCategories(categories);

  const keywords = await createKeywordPrompts();
  await loadKeywords(keywords);
  // Call the function to generate the seed data
  const seedCategoriesData = await createQuizCategories();
  await loadQuizCategories(seedCategoriesData);

  await createYearMonthWeekDays();
  await createQuiz();
  // loadQuestions(seedQuestionsData);
  // dumpJSON();
}
main();