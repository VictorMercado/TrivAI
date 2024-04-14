import { getCurrentUser } from "@trivai/auth/lib/getCurrentUser";
import { prisma } from "@trivai/prisma";

async function getLiveQuestions() {
  const options = { timeZone: "America/Los_Angeles" };
  return await prisma.question.findMany({
    // where: {
    //   dateDue: {
    //     equals: new Date().toLocaleDateString("en-US", options),
    //   },
    // },
  });
}

export default async function AdminPage() {
  const data = await getLiveQuestions();

  return (
    <div className="">
      <div className="grid grid-cols-1 justify-center">
        <h1 className="m-4 px-4 text-3xl">
          <b>Live Questions</b>
        </h1>
        <div className="overflow-x-auto">
          <table
            className="table table-compact w-full md:table-normal"
            data-theme="black"
          >
            {/* head */}
            <thead className="">
              <tr>
                <th>#</th>
                <th>ID</th>
                <th>Category</th>
                <th>Image</th>
                <th>Date Due</th>
              </tr>
            </thead>
            <tbody>
              {data.map((entry, index) => (
                <tr key={index}>
                  <th>
                    <a href={entry.id}> {index + 1}</a>
                  </th>
                  <td>{entry.id}</td>
                  {/* <td>{entry.categoryId}</td> */}
                  {entry.image ? (
                    <td>
                      <a
                        className="text-blue-500"
                        target="_blank"
                        href={entry?.image}
                      >
                        {entry.image}
                      </a>
                    </td>
                  ) : null}
                  {/* <td>{entry.dateDue}</td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
