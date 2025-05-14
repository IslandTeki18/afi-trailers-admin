import * as React from "react";
import { useState, useCallback, useEffect } from "react";

interface Option {
  id: string;
  name: string;
}

interface ComboboxProps {
  label: string;
  options: Option[];
  variant?: "primary" | "secondary" | "success" | "danger";
  onSelect?: (option: Option) => void;
}

export const AutoComplete: React.FC<ComboboxProps> = ({
  label,
  options,
  variant = "primary",
  onSelect,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [filteredOptions, setFilteredOptions] = useState<Option[]>(options);

  const filterOptions = useCallback(
    (value: string) => {
      const filtered = options.filter((option) =>
        option.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredOptions(filtered);
    },
    [options]
  );

  useEffect(() => {
    filterOptions(inputValue);
  }, [inputValue, filterOptions]);

  const getVariantClasses = (
    element: "input" | "button" | "list" | "option"
  ) => {
    // ...existing classes code...
    const baseClasses = {
      input: "ring-1 ring-inset focus:ring-2 focus:ring-inset",
      button: "text-gray-400 dark:text-gray-500",
      list: "bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 dark:ring-gray-700",
      option: "text-gray-900 dark:text-gray-100",
    };

    const variantClasses = {
      primary: {
        input:
          "ring-gray-300 dark:ring-gray-600 focus:ring-indigo-600 dark:focus:ring-indigo-500",
        button: "hover:text-gray-500 dark:hover:text-gray-400",
        list: "shadow-lg",
        option: "hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-700",
      },
      secondary: {
        input:
          "ring-gray-300 dark:ring-gray-600 focus:ring-gray-600 dark:focus:ring-gray-500",
        button: "hover:text-gray-600 dark:hover:text-gray-300",
        list: "shadow-md",
        option: "hover:bg-gray-200 dark:hover:bg-gray-700",
      },
      success: {
        input:
          "ring-gray-300 dark:ring-gray-600 focus:ring-green-600 dark:focus:ring-green-500",
        button: "hover:text-green-500 dark:hover:text-green-400",
        list: "shadow-lg",
        option: "hover:bg-green-600 hover:text-white dark:hover:bg-green-700",
      },
      danger: {
        input:
          "ring-gray-300 dark:ring-gray-600 focus:ring-red-600 dark:focus:ring-red-500",
        button: "hover:text-red-500 dark:hover:text-red-400",
        list: "shadow-lg",
        option: "hover:bg-red-600 hover:text-white dark:hover:bg-red-700",
      },
    };

    return `${baseClasses[element]} ${variantClasses[variant][element]}`;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setIsOpen(true);

    // If input is cleared, reset the selected option
    if (value === "") {
      setSelectedOption(null);
      if (onSelect) onSelect({ id: "", name: "" });
    }
  };

  const handleOptionSelect = (option: Option) => {
    setSelectedOption(option);
    setInputValue(option.name);
    setIsOpen(false);

    // Call the onSelect callback when an option is selected
    if (onSelect) onSelect(option);
  };

  return (
    <div>
      <label
        htmlFor="combobox"
        className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
      >
        {label}
      </label>
      <div className="relative mt-2">
        <input
          id="combobox"
          type="text"
          className={`w-full rounded-md border-0 bg-white dark:bg-gray-800 py-1.5 pl-3 pr-12 text-gray-900 dark:text-gray-100 shadow-sm sm:text-sm sm:leading-6 ${getVariantClasses(
            "input"
          )}`}
          role="combobox"
          aria-controls="options"
          aria-expanded={isOpen}
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        />
        <button
          type="button"
          className={`absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none ${getVariantClasses(
            "button"
          )}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.76 9.2a.75.75 0 011.06.04l2.7 2.908 2.7-2.908a.75.75 0 111.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 01.04-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {isOpen && filteredOptions.length > 0 && (
          <ul
            className={`absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md py-1 text-base focus:outline-none sm:text-sm ${getVariantClasses(
              "list"
            )}`}
            id="options"
            role="listbox"
          >
            {filteredOptions.map((option) => (
              <li
                key={option.id}
                className={`relative cursor-default select-none py-2 pl-3 pr-9 ${getVariantClasses(
                  "option"
                )} ${
                  selectedOption?.id === option.id
                    ? "bg-indigo-600 text-white dark:bg-indigo-700"
                    : ""
                }`}
                id={`option-${option.id}`}
                role="option"
                tabIndex={-1}
                onClick={() => handleOptionSelect(option)}
              >
                <span
                  className={`block truncate ${
                    selectedOption?.id === option.id ? "font-semibold" : ""
                  }`}
                >
                  {option.name}
                </span>
                {selectedOption?.id === option.id && (
                  <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-white">
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
