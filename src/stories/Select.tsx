import React, { useEffect, useRef, useState } from "react";
import cn from "classnames";

interface Option {
  groupLabel?: string;
  label: string;
  value: string;
  disabled?: boolean;
  description?: string;
  icon?: React.ReactNode;
}

interface GroupOption {
  label: string;
  options: Option[];
}

export interface SelectProps {
  label?: string;
  defaultValue: string | string[];
  options: Option[];
  onChange: (value: string | string[]) => void;
  disabled?: boolean;
  allowClear?: boolean;
  searchInput?: boolean;
  multipleSelection?: boolean;
  selectAll?: boolean;
  maxSelect?: number;
  hideSelected?: boolean;
  size: "small" | "default" | "large";
  status?: "default" | "warning" | "error";
}

const Select = ({
  label = "Select",
  defaultValue,
  options,
  onChange,
  disabled = false,
  size = "default",
  allowClear,
  searchInput,
  multipleSelection,
  selectAll,
  maxSelect,
  hideSelected,
  status,
}: SelectProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [hasFocus, setHasFocus] = useState<boolean>(false);
  const [isClosing, setIsClosing] = useState<boolean>(false);
  const [selectedLabels, setSelectedLabels] = useState<string[]>(
    Array.isArray(defaultValue)
      ? options
          .filter((option) => defaultValue.includes(option.value))
          .map((option) => option.label)
      : options.find((option) => option.value === defaultValue)?.label
        ? [
            options.find((option) => option.value === defaultValue)?.label ||
              label,
          ]
        : []
  );
  const [selectedValues, setSelectedValues] = useState<string[]>(
    Array.isArray(defaultValue) ? defaultValue : []
  );
  const [searchValue, setSearchValue] = useState<string>("");

  const selectRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setHasFocus(false);
        setSearchValue("");
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    if (isOpen && searchInput && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, searchInput]);

  const toggleMenu = (event?: React.MouseEvent) => {
    if (!disabled) {
      if (isOpen) {
        setIsClosing(true);
        setTimeout(() => {
          setIsOpen(false);
          setIsClosing(false);
          setSearchValue("");
        }, 300);
      } else {
        setIsOpen(true);
        setHasFocus(true);
        if (event) {
          event.stopPropagation();
        }
      }
    }
  };

  const handleOptionClick = (
    value: string,
    label: string,
    disabled?: boolean
  ) => {
    if (!disabled) {
      let newSelectedValues = [...selectedValues];
      let newSelectedLabels = [...selectedLabels];
      if (multipleSelection) {
        if (newSelectedValues.includes(value)) {
          newSelectedValues = newSelectedValues.filter((v) => v !== value);
          newSelectedLabels = newSelectedLabels.filter((l) => l !== label);
        } else {
          if (!maxSelect || newSelectedValues.length < maxSelect) {
            newSelectedValues.push(value);
            newSelectedLabels.push(label);
          }
        }
      } else {
        newSelectedValues = [value];
        newSelectedLabels = [label];
        setIsClosing(true);
        setTimeout(() => {
          setIsOpen(false);
          setIsClosing(false);
          setSearchValue("");
        }, 200);
      }
      setSelectedValues(newSelectedValues);
      setSelectedLabels(newSelectedLabels);
      onChange(multipleSelection ? newSelectedValues : value);
    }
  };

  const handleRemoveSelectedOption = (
    e: React.MouseEvent<SVGElement>,
    value: string
  ) => {
    e.stopPropagation();
    if (!disabled) {
      const newSelectedValues = selectedValues.filter((v) => v !== value);
      const newSelectedLabels = newSelectedValues.map(
        (v) => options.find((option) => option.value === v)?.label || ""
      );
      setSelectedValues(newSelectedValues);
      setSelectedLabels(newSelectedLabels);
      onChange(newSelectedValues);
    }
  };

  const filteredOptions = options.filter(
    (option) =>
      option.label.toLowerCase().includes(searchValue.toLowerCase()) &&
      !(hideSelected && selectedValues.includes(option.value))
  );

  const handleSelectAll = (options: Option[]) => {
    const allAvailableValues = options
      .filter((option) => !option.disabled)
      .map((option) => option.value);
    const allAvailableLabels = options
      .filter((option) => !option.disabled)
      .map((option) => option.label);
    if (maxSelect && maxSelect >= allAvailableLabels.length) {
      if (
        selectedValues.length ===
        filteredOptions.filter((option) => !option.disabled).length
      ) {
        setSelectedValues([]);
        setSelectedLabels([]);
        onChange([]);
      } else {
        setSelectedValues(allAvailableValues);
        setSelectedLabels(allAvailableLabels);
        onChange(allAvailableValues);
      }
    } else if (!maxSelect) {
      if (
        selectedValues.length ===
        filteredOptions.filter((option) => !option.disabled).length
      ) {
        setSelectedValues([]);
        setSelectedLabels([]);
        onChange([]);
      } else {
        setSelectedValues(allAvailableValues);
        setSelectedLabels(allAvailableLabels);
        onChange(allAvailableValues);
      }
    }
  };

  const handleClearSelection = (e: React.MouseEvent<SVGElement>) => {
    e.stopPropagation();
    setSelectedValues([]);
    setSelectedLabels([]);
    onChange([]);
  };

  const hasEnabledOptions = filteredOptions.some((option) => !option.disabled);

  return (
    <div
      ref={selectRef}
      className="border-box m-0 p-0 relative inline-block cursor-pointer text-sm w-full"
    >
      <div
        onClick={toggleMenu}
        title={selectedLabels.join(", ")}
        className={cn(
          "border-none outline outline-1 outline-gray-300 bg-white rounded hover:outline-blue-500 place-content-center h-8 pl-2 pr-6 transition-outline duration-300 truncate text-gray-900",
          {
            "!h-6": size === "small",
            "!h-10": size === "large",
            "!outline-blue-500": hasFocus,
            "!outline-red-500": hasFocus && status === "error",
            "!outline-yellow-400": hasFocus && status === "warning",
            "cursor-not-allowed hover:outline-gray-300 !bg-gray-400/20 ":
              disabled,
            "!cursor-text": searchInput,
            "!text-gray-300": label,
            "!text-gray-900": selectedLabels,
            "outline-red-500 hover:!outline-red-500":
              !disabled && status === "error",
            "!outline-yellow-400 hover:!outline-yellow-400":
              !disabled && status === "warning",
            "!pr-14": maxSelect,
          }
        )}
      >
        {searchInput && isOpen ? (
          <input
            ref={inputRef}
            className={cn("w-full outline-none text-gray-900", {
              "cursor-text": searchInput,
              "hover:cursor-not-allowed": disabled,
            })}
            type="text"
            placeholder={
              selectedLabels.length > 0 ? selectedLabels.join(", ") : label
            }
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <div className="flex gap-x-1 overflow-hidden whitespace-nowrap items-center mr-4">
            {selectedLabels.length > 0 ? (
              selectedLabels.map((selectedLabel, index) => {
                const value = selectedValues[index];
                return (
                  <span
                    key={index}
                    className={cn("flex items-center  rounded ", {
                      "bg-gray-200/80 px-1.5 py-0.5": multipleSelection,
                      "!py-0": size === "small" && multipleSelection,
                      "!py-1": size === "large" && multipleSelection,
                      "text-gray-400": disabled,
                    })}
                  >
                    {selectedLabel}
                    {multipleSelection && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="20px"
                        viewBox="0 -960 960 960"
                        width="20px"
                        className={cn("fill-gray-400 hover:fill-gray-600", {
                          "cursor-pointer": searchInput,
                        })}
                        onClick={(e) => handleRemoveSelectedOption(e, value)}
                      >
                        <path d="m291-240-51-51 189-189-189-189 51-51 189 189 189-189 51 51-189 189 189 189-51 51-189-189-189 189Z" />
                      </svg>
                    )}
                  </span>
                );
              })
            ) : (
              <span className="text-gray-300">{label}</span>
            )}
          </div>
        )}
      </div>
      <span
        onClick={toggleMenu}
        className={cn("absolute right-1.5 top-1.5 flex items-center", {
          "!top-0.5": size === "small",
          "!top-2.5": size === "large",
          "hover:cursor-not-allowed": disabled,
          "cursor-text": searchInput,
          "!cursor-pointer": allowClear,
        })}
      >
        {multipleSelection && maxSelect !== undefined && maxSelect > 0 && (
          <div className="text-gray-300">
            {selectedValues.length}/{maxSelect}
          </div>
        )}

        {allowClear && selectedValues.length > 0 ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="20px"
            viewBox="0 -960 960 960"
            width="20px"
            className="fill-gray-300 hover:fill-gray-500"
            onClick={(e) => handleClearSelection(e)}
          >
            <path d="m339-288 141-141 141 141 51-51-141-141 141-141-51-51-141 141-141-141-51 51 141 141-141 141 51 51ZM480-96q-79 0-149-30t-122.5-82.5Q156-261 126-331T96-480q0-80 30-149.5t82.5-122Q261-804 331-834t149-30q80 0 149.5 30t122 82.5Q804-699 834-629.5T864-480q0 79-30 149t-82.5 122.5Q699-156 629.5-126T480-96Zm0-72q130 0 221-91t91-221q0-130-91-221t-221-91q-130 0-221 91t-91 221q0 130 91 221t221 91Zm0-312Z" />
          </svg>
        ) : searchInput && isOpen ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="20"
            viewBox="0 -960 960 960"
            width="20px"
            className="fill-gray-200/60"
          >
            <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="20px"
            viewBox="0 -960 960 960"
            width="20px"
            className="fill-gray-200/60"
          >
            <path d="M480-333 240-573l51-51 189 189 189-189 51 51-240 240Z" />
          </svg>
        )}
      </span>
      {(isOpen || isClosing) && (
        <div
          className={cn(
            "relative rounded bg-white shadow mt-1 p-1 transition-opacity duration-500",
            {
              "opacity-100": isOpen && !isClosing,
              "opacity-0": isClosing,
            }
          )}
        >
          {selectAll &&
            multipleSelection &&
            hasEnabledOptions &&
            searchValue === "" && (
              <div
                onClick={() => handleSelectAll(filteredOptions)}
                className={cn(
                  "p-2 rounded truncate flex gap-1 items-center hover:bg-gray-200/50 cursor-pointer ",
                  {
                    "bg-blue-500/10 hover:bg-blue-500/10":
                      selectedValues.length ===
                      filteredOptions.filter((option) => !option.disabled)
                        .length,
                    "text-gray-300 hover:cursor-not-allowed":
                      maxSelect &&
                      maxSelect <
                        filteredOptions.filter((option) => !option.disabled)
                          .length,
                  }
                )}
              >
                <div>
                  {selectedValues.length ===
                  filteredOptions.filter((option) => !option.disabled)
                    .length ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="20px"
                      viewBox="0 -960 960 960"
                      width="20px"
                      className="fill-blue-400"
                    >
                      <path d="m424-312 282-282-56-56-226 226-114-114-56 56 170 170ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm0-560v560-560Z" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="20px"
                      viewBox="0 -960 960 960"
                      width="20px"
                      className="fill-gray-200/60"
                    >
                      <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Z" />
                    </svg>
                  )}
                </div>
                Select All
              </div>
            )}
          {filteredOptions.length > 0 ? (
            [
              filteredOptions.map((option, i) => (
                <div
                  key={`${option.value}-${i}`}
                  onClick={() =>
                    handleOptionClick(
                      option.value,
                      option.label,
                      option.disabled
                    )
                  }
                  title={option.label}
                  className={cn(
                    "p-2 rounded truncate flex gap-1 items-center",
                    {
                      "bg-blue-500/10":
                        selectedValues.includes(option.value) &&
                        !option.disabled,
                      "hover:bg-gray-200/50":
                        !selectedValues.includes(option.value) &&
                        !option.disabled,
                      "text-gray-300 cursor-not-allowed":
                        option.disabled ||
                        (maxSelect &&
                          selectedValues.length >= maxSelect &&
                          !selectedValues.includes(option.value)),
                    }
                  )}
                >
                  <div>
                    {multipleSelection &&
                      selectedValues.includes(option.value) && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height="20px"
                          viewBox="0 -960 960 960"
                          width="20px"
                          className="fill-blue-400"
                        >
                          <path d="m424-312 282-282-56-56-226 226-114-114-56 56 170 170ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm0-560v560-560Z" />
                        </svg>
                      )}
                    {multipleSelection &&
                      !selectedValues.includes(option.value) && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height="20px"
                          viewBox="0 -960 960 960"
                          width="20px"
                          className="fill-gray-200/60"
                        >
                          <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Z" />
                        </svg>
                      )}
                  </div>
                  {option.icon && option.icon}
                  {option.label}
                  {option.description && <span>({option.description})</span>}
                </div>
              )),
            ]
          ) : (
            <div className="p-2 text-gray-500 cursor-default">No data</div>
          )}
        </div>
      )}
    </div>
  );
};

export default Select;
