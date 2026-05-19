import EmptyState from "./EmptyState";

export default function DataTable({
  columns = [],
  data = [],
  rowKey = "id",
  emptyTitle,
  emptyDescription,
  className = "",
}) {
  if (!data.length) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        className={className}
      />
    );
  }

  function getRowKey(row, index) {
    if (typeof rowKey === "function") {
      return rowKey(row, index);
    }

    return row?.[rowKey] || index;
  }

  return (
    <div
      className={[
        "overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm",
        className,
      ].join(" ")}
    >
      <div className="overflow-x-auto">
        <table className="w-full divide-y divide-slate-200 text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  className={["px-5 py-3.5 font-semibold", column.headerClassName].join(
                    " "
                  )}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {data.map((row, rowIndex) => (
              <tr
                key={getRowKey(row, rowIndex)}
                className="transition hover:bg-primary-50/40"
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={[
                      "px-5 py-4 align-middle text-slate-700",
                      column.className,
                    ].join(" ")}
                  >
                    {column.render
                      ? column.render(row, rowIndex)
                      : row?.[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
