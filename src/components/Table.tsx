import ClientRow from "./ClientRow";

function Table({
  title,
  data,
  thead,
}: {
  title: string;
  data: any;
  thead: any;
}) {
  let keys: Array<string> = [];
  if (data.length > 0) keys = Object.keys(data[0]);
  return (
    <div>
      <h1 className="m-4 px-4 text-3xl">
        <b>{title}</b>
      </h1>
      <div className="overflow-x-auto">
        <table
          className="table table-compact mb-4 w-full md:table-normal "
          data-theme="black"
        >
          {/* head */}
          <thead className="">
            <tr>
              {thead.map((entry: string, index: number) => (
                <th key={index}>{entry}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((entry: any, index: number) => (
              <tr key={index}>
                {keys.map((key, index) =>
                  key === "image" ? (
                    <td key={index}>
                      <a
                        className="text-blue-500"
                        target="_blank"
                        href={`${entry[key]}`}
                      >{`${entry[key]}`}</a>
                    </td>
                  ) : (
                    <td key={index}>{`${entry[key]}`}</td>
                  ),
                )}
              </tr>
            ))}
            <ClientRow keys={keys} title={title.toLowerCase()} />
          </tbody>
        </table>
      </div>
    </div>
  );
}

export { Table };