import { Button } from "./Button";

type Column = {
  header: string;
  accessor: string;
  isAction?: boolean;
};

type TableProps = {
  title?: string;
  description?: string;
  data: any[];
  columns: Column[];
  addButtonText?: string;
  onAdd?: () => void;
  onEdit?: (item: any) => void;
  onView?: (item: any) => void;
  variant?: "primary" | "secondary" | "accent" | "error" | "transparent";
};

export function Table({
  title,
  description,
  data,
  columns,
  addButtonText,
  onAdd,
  onEdit,
  onView,
  variant = "transparent",
}: TableProps) {
  const variantClasses = {
    primary: {
      headerText: "text-gray-900",
      descriptionText: "text-gray-700",
      table: "divide-gray-300",
      tableBody: "divide-gray-200",
      headerCell: "text-gray-900",
      cell: "text-gray-500",
      actionLink: "text-primary-600 hover:text-primary-900",
      button:
        "bg-primary-600 hover:bg-primary-500 focus-visible:outline-primary-600",
    },
    secondary: {
      headerText: "text-gray-900",
      descriptionText: "text-gray-700",
      table: "divide-gray-300",
      tableBody: "divide-gray-200",
      headerCell: "text-gray-900",
      cell: "text-gray-500",
      actionLink: "text-secondary-600 hover:text-secondary-900",
      button:
        "bg-secondary-600 hover:bg-secondary-500 focus-visible:outline-secondary-600",
    },
    accent: {
      headerText: "text-gray-900",
      descriptionText: "text-gray-700",
      table: "divide-gray-300",
      tableBody: "divide-gray-200",
      headerCell: "text-gray-900",
      cell: "text-gray-500",
      actionLink: "text-accent-600 hover:text-accent-900",
      button:
        "bg-accent-600 hover:bg-accent-500 focus-visible:outline-accent-600",
    },
    error: {
      headerText: "text-gray-900",
      descriptionText: "text-gray-700",
      table: "divide-gray-300",
      tableBody: "divide-gray-200",
      headerCell: "text-gray-900",
      cell: "text-gray-500",
      actionLink: "text-error-600 hover:text-error-900",
      button: "bg-error-600 hover:bg-error-500 focus-visible:outline-error-600",
    },
    transparent: {
      headerText: "text-gray-900",
      descriptionText: "text-gray-700",
      table: "divide-gray-300",
      tableBody: "divide-gray-200",
      headerCell: "text-gray-900",
      cell: "text-gray-500",
      actionLink: "text-indigo-600 hover:text-indigo-900",
      button:
        "bg-indigo-600 hover:bg-indigo-500 focus-visible:outline-indigo-600",
    },
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      {(title || description || addButtonText) && (
        <div className="sm:flex sm:items-center">
          {(title || description) && (
            <div className="sm:flex-auto">
              {title && (
                <h1
                  className={`text-base font-semibold ${variantClasses[variant].headerText}`}
                >
                  {title}
                </h1>
              )}
              {description && (
                <p
                  className={`mt-2 text-sm ${variantClasses[variant].descriptionText}`}
                >
                  {description}
                </p>
              )}
            </div>
          )}
          {addButtonText && (
            <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
              <button
                type="button"
                onClick={onAdd}
                className={`block rounded-md ${variantClasses[variant].button} px-3 py-2 text-center text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2`}
              >
                {addButtonText}
              </button>
            </div>
          )}
        </div>
      )}

      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table
              className={`min-w-full divide-y ${variantClasses[variant].table}`}
            >
              <thead>
                <tr>
                  {columns.map((column, index) => (
                    <th
                      key={column.header}
                      scope="col"
                      className={`py-3.5 ${
                        index === 0 ? "pl-4 pr-3 sm:pl-0" : "px-3"
                      } text-left text-sm font-semibold ${
                        variantClasses[variant].headerCell
                      } ${
                        column.isAction
                          ? "relative py-3.5 pl-3 pr-4 sm:pr-0"
                          : ""
                      }`}
                    >
                      {column.isAction ? (
                        <span className="sr-only">{column.header}</span>
                      ) : (
                        column.header
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody
                className={`divide-y ${variantClasses[variant].tableBody}`}
              >
                {data.map((item, rowIndex) => (
                  <tr key={item.id || rowIndex}>
                    {columns.map((column, colIndex) => {
                      const isFirstColumn = colIndex === 0;
                      if (column.isAction) {
                        return (
                          <td
                            key={column.accessor}
                            className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0"
                          >
                            <div className="flex justify-end space-x-3">
                              {onView && (
                                <a
                                  href="#"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    onView(item);
                                  }}
                                  className={variantClasses[variant].actionLink}
                                >
                                  View
                                  <span className="sr-only">
                                    , {String(item[columns[0].accessor])}
                                  </span>
                                </a>
                              )}
                              {onEdit && (
                                <a
                                  href="#"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    onEdit(item);
                                  }}
                                  className={variantClasses[variant].actionLink}
                                >
                                  Edit
                                  <span className="sr-only">
                                    , {String(item[columns[0].accessor])}
                                  </span>
                                </a>
                              )}
                            </div>
                          </td>
                        );
                      } else {
                        return (
                          <td
                            key={column.accessor}
                            className={`whitespace-nowrap ${
                              isFirstColumn
                                ? "py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0"
                                : "px-3 py-4 text-sm " +
                                  variantClasses[variant].cell
                            }`}
                            title={String(item[column.accessor])}
                          >
                            {String(item[column.accessor])}
                          </td>
                        );
                      }
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
