import React, {
  memo,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Option, Select2Props } from "./types/types.ts";
import cn from "classnames";
import "../style.css";
import { BsChevronDown, BsInbox, BsSearch, BsXCircle } from "react-icons/bs";
import { FaXmark } from "react-icons/fa6";
import { MdCheckBoxOutlineBlank, MdOutlineCheckBox } from "react-icons/md";
import {
  LABEL_CN,
  PLACEMENT_CN,
  SIZE_CN,
  STATUS_CN,
  VARIANT_CN,
} from "./constants.tsx";
import { VscLoading } from "react-icons/vsc";

const Select2 = memo(
  ({
    style,
    options,
    placeholder = "Placeholder",
    label,
    labelModel,
    size = "medium",
    status = "default",
    variant = "outlined",
    disabled = false,
    loading = false,
    searchable = false,
    clearable = false,
    clearOnSelect = true,
    mode = "single",
    multiCheckbox = false,
    selectAll = false,
    hideSelected = false,
    maxSelect,
    renderLabel,
    menuPlacement = "bottomLeft",
    responsiveMultiple,
    highlightOnHover = false,
    menuNoData,
    menuLabel,
    icon,
  }: Select2Props) => {
    const selectRef = useRef<HTMLDivElement>(null);
    const overflowRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const [hasFocus, setHasFocus] = useState<boolean>(false);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [searchValue, setSearchValue] = useState<string>("");
    const [selectedValue, setSelectedValue] = useState<string>("");
    const [selectedLabel, setSelectedLabel] = useState<string>("");
    const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
    const [selectedValues, setSelectedValues] = useState<string[]>([]);
    const [isMouseOver, setIsMouseOver] = useState<boolean>(false);
    const [overflowsCount, setOverflowsCount] = useState<[number, number]>([
      0, 0,
    ]);

    // When you clicked selectbox, automatically focus the input field
    useLayoutEffect(() => {
      if (isOpen && searchable && inputRef.current) {
        inputRef.current.focus();
      }
    }, [isOpen, searchable]);

    // Overflow selection
    useLayoutEffect(() => {
      const container = overflowRef.current;
      if (!container) return;
      const containerWidth = container.offsetWidth;
      let currentWidth = 0;
      let flowCount = 0;
      let overflowCount = 0;

      const labels = container.querySelectorAll("span");

      for (let i = 0; i < selectedValues.length; i++) {
        const label = labels[i];
        if (label instanceof HTMLElement) {
          currentWidth += label.offsetWidth + 4;

          currentWidth > containerWidth ? overflowCount++ : flowCount++;
        }
      }
      setOverflowsCount([
        flowCount,
        overflowCount > 0 ? overflowCount + 1 : overflowCount,
      ]);
    }, [selectedValues]);

    // Close menu when click outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          selectRef.current &&
          !selectRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
          setHasFocus(false);
          setSearchValue("");
        }
      };
      document.addEventListener("mousedown", handleClickOutside);

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);

    // Toggle menu open/close
    const toggleMenu = useCallback(() => {
      if (!disabled) {
        setIsOpen(!isOpen);
        setHasFocus(true);
      }
    }, [isOpen, disabled]);

    // Select menu
    const handleOptionClick = useCallback(
      (value: string, label: string, optionDisabled?: boolean) => {
        if (!optionDisabled && !disabled) {
          if (mode === "multi") {
            setSelectedValues((prevValues) => {
              const selectedIndex = prevValues.indexOf(value);
              if (selectedIndex === -1) {
                if (maxSelect && prevValues.length >= maxSelect) {
                  return prevValues;
                }
                return [...prevValues, value];
              } else {
                return prevValues.filter((v) => v !== value);
              }
            });
            setSelectedLabels((prevLabels) => {
              const selectedIndex = prevLabels.indexOf(label);
              if (selectedIndex === -1) {
                return [...prevLabels, label];
              } else {
                return prevLabels.filter((l) => l !== label);
              }
            });
            clearOnSelect && setSearchValue("");
          } else {
            setSelectedValue(value);
            setSelectedLabel(label);
            setSearchValue("");
          }
          if (mode === "single") {
            setIsOpen(false);
          }
        }
      },
      [clearOnSelect, disabled, maxSelect, mode]
    );

    // Select all values
    const handleSelectAll = useCallback(() => {
      if (options) {
        if (
          options.filter((option) => !option.disabled).length ===
          selectedValues.length
        ) {
          setSelectedValues([]);
          setSelectedLabels([]);
        } else {
          if (
            maxSelect &&
            options.filter((option) => !option.disabled).length > maxSelect
          ) {
          } else {
            const allValues = options
              .filter((option) => !option.disabled)
              .map((option) => option.value);
            const allLabels = options
              .filter((option) => !option.disabled)
              .map((option) => option.label);
            setSelectedValues(allValues);
            setSelectedLabels(allLabels);
          }
        }
      }
    }, [options, maxSelect, selectedValues]);

    // Clear all selected values
    const handleClearSelection = useCallback(
      (event: React.MouseEvent) => {
        event.stopPropagation();
        if (!disabled) {
          if (mode === "multi") {
            setSelectedValues([]);
            setSelectedLabels([]);
          } else {
            setSelectedValue("");
            setSelectedLabel("");
          }
          setSearchValue("");
        }
      },
      [disabled, mode]
    );

    // Clear value
    const handleClearOption = useCallback(
      (event: React.MouseEvent, index: number) => {
        event.stopPropagation();
        if (!disabled) {
          const newSelectedValues = [...selectedValues];
          newSelectedValues.splice(index, 1);
          setSelectedValues(newSelectedValues);

          const newSelectedLabels = [...selectedLabels];
          newSelectedLabels.splice(index, 1);
          setSelectedLabels(newSelectedLabels);
        }
      },
      [selectedLabels, selectedValues, disabled]
    );

    const filteredOptions = useCallback(() => {
      if (!options) return [];

      let optionsToFilter = options.filter((option) => !option.disabled);

      if (hideSelected) {
        optionsToFilter = options.filter(
          (option) => !selectedValues.includes(option.value)
        );
      }

      if (searchValue && selectedLabel) {
        optionsToFilter = optionsToFilter.filter((option) =>
          option.label.toLowerCase().includes(searchValue.toLowerCase())
        );
      } else if (searchValue && selectedLabels) {
        optionsToFilter = optionsToFilter.filter((option) =>
          option.label.toLowerCase().includes(searchValue.toLowerCase())
        );
      }

      return (Object as any).groupBy(
        optionsToFilter,
        ({ category }) => category
      );
    }, [
      options,
      selectedValues,
      hideSelected,
      searchValue,
      selectedLabel,
      selectedLabels,
    ]);

    const renderOptions = useCallback(() => {
      const filteredSearch = filteredOptions();
      if (!filteredSearch || Object.keys(filteredSearch).length === 0) {
        return (
          (menuNoData && menuNoData()) || (
            <div className="text-gray-500 text-sm flex flex-col gap-2 items-center justify-center text-nowrap py-5 px-2">
              {icon ? icon.menuNoData : <BsInbox size={32} />}
              No data
            </div>
          )
        );
      }

      return (
        <div
          className={cn("flex flex-col gap-y-1 py-2 overflow-y-auto max-h-64")}
        >
          {selectAll && mode === "multi" && (
            <span
              onClick={handleSelectAll}
              className={cn(
                "border-l-2 border-transparent hover:border-blue-500 text-gray-900 py-1 px-3 flex items-center text-sm gap-x-1 cursor-pointer hover:bg-gray-100",
                {
                  "bg-gray-100":
                    selectedValues.length ===
                    options?.filter((option) => !option.disabled)?.length,
                }
              )}
            >
              {multiCheckbox &&
                (selectedValues.length ===
                options?.filter((option) => !option.disabled)?.length ? (
                  icon ? (
                    icon.selectAllFill
                  ) : (
                    <MdOutlineCheckBox className="fill-blue-500" />
                  )
                ) : icon ? (
                  icon.selectAllBlank
                ) : (
                  <MdCheckBoxOutlineBlank className="fill-gray-300" />
                ))}
              Select All
            </span>
          )}
          {Object.entries(filteredOptions()).map((group: any, i) => {
            const [key, value]: [key: string, value: Option[]] = group;
            if (key !== "undefined") {
              return (
                <div className="text-gray-900 flex flex-col gap-y-1" key={i}>
                  <div className="px-1 text-sm text-gray-500">{key}</div>
                  {value.map((m, index) =>
                    menuLabel ? (
                      <div
                        key={index}
                        onClick={() =>
                          handleOptionClick(m.value, m.label, m.disabled)
                        }
                      >
                        {menuLabel(m.label)}
                      </div>
                    ) : (
                      <div
                        key={index}
                        title={highlightOnHover ? m.label : ""}
                        className={cn(
                          "px-3 border-l-2 border-transparent hover:border-l-blue-500 hover:bg-gray-100 cursor-pointer py-1 flex items-center gap-x-1 text-sm whitespace-nowrap",
                          {
                            "bg-gray-100":
                              (selectedValue.includes(m.value) &&
                                mode === "single") ||
                              (selectedValues.includes(m.value) &&
                                mode === "multi"),
                            "bg-gray-200 hover:bg-gray-200 !cursor-not-allowed":
                              m.disabled,
                          }
                        )}
                        onClick={() =>
                          handleOptionClick(m.value, m.label, m.disabled)
                        }
                      >
                        {mode === "multi" &&
                          multiCheckbox &&
                          (selectedValues.includes(m.value) ? (
                            icon ? (
                              icon.selectAllFill
                            ) : (
                              <MdOutlineCheckBox className="fill-blue-500" />
                            )
                          ) : icon ? (
                            icon.selectAllBlank
                          ) : (
                            <MdCheckBoxOutlineBlank className="fill-gray-300" />
                          ))}
                        {m.icon && m.icon}
                        {m.label}
                        <div className="truncate">{m.description}</div>
                      </div>
                    )
                  )}
                </div>
              );
            } else {
              return value.map((m) =>
                menuLabel ? (
                  <div
                    onClick={() =>
                      handleOptionClick(m.value, m.label, m.disabled)
                    }
                  >
                    {menuLabel(m.label)}
                  </div>
                ) : (
                  <div
                    title={highlightOnHover ? m.label : ""}
                    className={cn(
                      "px-2 border-l-2 border-transparent hover:border-l-blue-500 hover:bg-gray-100 cursor-pointer py-1 flex items-center gap-x-1 text-sm  whitespace-nowrap",
                      {
                        "bg-gray-100":
                          (selectedValue.includes(m.value) &&
                            mode === "single") ||
                          (selectedValues.includes(m.value) &&
                            mode === "multi"),
                        "bg-gray-200 hover:bg-gray-200 !cursor-not-allowed":
                          m.disabled,
                      }
                    )}
                    onClick={() =>
                      handleOptionClick(m.value, m.label, m.disabled)
                    }
                  >
                    {mode === "multi" &&
                      multiCheckbox &&
                      (selectedValues.includes(m.value) ? (
                        icon ? (
                          icon.selectAllFill
                        ) : (
                          <MdOutlineCheckBox className="fill-blue-500" />
                        )
                      ) : icon ? (
                        icon.selectAllBlank
                      ) : (
                        <MdCheckBoxOutlineBlank className="fill-gray-300" />
                      ))}
                    {m.icon && m.icon}
                    {m.label}
                    <div className="truncate">{m.description}</div>
                  </div>
                )
              );
            }
          })}
        </div>
      );
    }, [
      filteredOptions,
      handleOptionClick,
      handleSelectAll,
      highlightOnHover,
      menuLabel,
      menuNoData,
      mode,
      multiCheckbox,
      options,
      selectAll,
      selectedValues,
      selectedValue,
      icon,
    ]);

    return (
      <div style={style} ref={selectRef} className="flex flex-col relative">
        {label && (
          <p
            title={highlightOnHover ? label : ""}
            className={cn(
              "text-xs text-gray-500 truncate max-w-48",
              LABEL_CN[labelModel || "default"],
              {
                "transition ease-in opacity-100 ":
                  isOpen === true && labelModel === "open",
              }
            )}
          >
            {label}
          </p>
        )}
        <div
          onMouseEnter={() => setIsMouseOver(true)}
          onMouseLeave={() => setIsMouseOver(false)}
          onClick={toggleMenu}
          className={cn(
            "relative flex justify-between items-center gap-1 outline outline-1 cursor-pointer text-sm border-none  rounded text-gray-900 px-2",
            SIZE_CN[size || "medium"],
            VARIANT_CN[variant || "outlined"],
            STATUS_CN[status || "default"],
            {
              "bg-transparent hover:bg-transparent !outline-blue-500 ":
                isOpen && variant === "filled",
              "pl-1": mode === "multi" && selectedLabels.length > 0,
              "!bg-gray-200 hover:outline-gray-300 hover:cursor-not-allowed !text-gray-400":
                disabled,
              "!outline-blue-500":
                hasFocus && !(variant === ("filled" || "borderless")),
              "cursor-text": searchable,
            }
          )}
        >
          {searchable && !disabled ? (
            <div
              ref={overflowRef}
              className={cn("flex gap-1 truncate w-full cursor-default", {
                "flex-wrap": !responsiveMultiple,
              })}
            >
              {mode === "multi" && selectedLabels && (
                <React.Fragment>
                  {selectedLabels
                    .slice(
                      0,
                      responsiveMultiple
                        ? overflowsCount[1] > 0
                          ? overflowsCount[0] - 1
                          : overflowsCount[0] + 1
                        : selectedLabels.length
                    )
                    .map((label, i) =>
                      renderLabel ? (
                        renderLabel(label)
                      ) : (
                        <span
                          title={highlightOnHover ? label : ""}
                          key={i}
                          className={cn(
                            "text-gray-900 bg-gray-200 px-1 rounded flex items-center",
                            {
                              "py-1": size === "large",
                              "bg-white": variant === "filled",
                            }
                          )}
                        >
                          {label}
                          <FaXmark
                            onClick={(event) => handleClearOption(event, i)}
                            className="fill-gray-400 hover:fill-gray-500 cursor-pointer"
                          />
                        </span>
                      )
                    )}
                  {responsiveMultiple &&
                    overflowsCount[1] > 0 &&
                    (renderLabel ? (
                      renderLabel("+ " + overflowsCount[1] + " ...")
                    ) : (
                      <div
                        title={
                          highlightOnHover
                            ? selectedLabels
                                .slice(
                                  overflowsCount[0] - 1,
                                  overflowsCount[0] + overflowsCount[1]
                                )
                                .map((l) => l)
                                .join(" ,")
                            : ""
                        }
                        className="text-gray-900 bg-gray-200 px-1 rounded flex items-center"
                      >
                        + {overflowsCount[1]} ...
                      </div>
                    ))}
                </React.Fragment>
              )}
              <input
                ref={inputRef}
                placeholder={
                  selectedLabel
                    ? selectedLabel
                    : selectedLabels.length > 0
                      ? ""
                      : placeholder
                }
                title={highlightOnHover ? selectedLabel || placeholder : ""}
                value={searchValue}
                onChange={(e) => {
                  setSearchValue(e.target.value);
                }}
                onClick={() => setIsOpen(true)}
                className={cn(
                  "flex-1 min-w-0 outline-none placeholder:focus:text-gray-400 whitespace-normal bg-transparent ",
                  {
                    "placeholder:text-gray-900 ":
                      (mode === "single" && selectedLabel) ||
                      (mode === "multi" && selectedLabels.length > 0),
                    "flex-none max-w-fit": responsiveMultiple,
                  }
                )}
              />
              {responsiveMultiple &&
                selectedLabels
                  .slice(
                    overflowsCount[1] > 0
                      ? overflowsCount[0] - 1
                      : overflowsCount[0],
                    overflowsCount[0] + overflowsCount[1] + 1
                  )
                  .map((label, i) =>
                    renderLabel ? (
                      renderLabel(label)
                    ) : (
                      <span
                        key={i}
                        className={cn(
                          "text-gray-900 bg-gray-200 px-1 rounded items-center flex opacity-0",
                          {
                            "py-1": size === "large",
                            "bg-white": variant === "filled",
                          }
                        )}
                      >
                        {label}
                        <FaXmark className="fill-gray-400 hover:fill-gray-500" />
                      </span>
                    )
                  )}
            </div>
          ) : (
            <div
              ref={overflowRef}
              title={highlightOnHover ? selectedLabel || placeholder : ""}
              className={cn("flex w-full truncate gap-1 text-gray-400", {
                "text-gray-900": selectedLabel,
                "flex-wrap": !responsiveMultiple,
              })}
            >
              {mode === "multi" ? (
                selectedLabels.length > 0 ? (
                  <React.Fragment>
                    {selectedLabels
                      .slice(
                        0,
                        responsiveMultiple
                          ? overflowsCount[1] > 0
                            ? overflowsCount[0] - 1
                            : overflowsCount[0] + 1
                          : selectedLabels.length
                      )
                      .map((label, i) =>
                        renderLabel ? (
                          renderLabel(label)
                        ) : (
                          <span
                            title={highlightOnHover ? label : ""}
                            key={i}
                            className={cn(
                              "text-gray-900 bg-gray-200 px-1 rounded flex items-center",
                              {
                                "py-1": size === "large",
                                "bg-white": variant === "filled",
                              }
                            )}
                          >
                            {label}
                            <FaXmark
                              onClick={(event) => handleClearOption(event, i)}
                              className="fill-gray-400 hover:fill-gray-500"
                            />
                          </span>
                        )
                      )}
                    {responsiveMultiple &&
                      overflowsCount[1] > 0 &&
                      (renderLabel ? (
                        renderLabel("+ " + overflowsCount[1] + " ...")
                      ) : (
                        <div
                          title={
                            highlightOnHover
                              ? selectedLabels
                                  .slice(
                                    overflowsCount[0] - 1,
                                    overflowsCount[0] + overflowsCount[1]
                                  )
                                  .map((l) => l)
                                  .join(" ,")
                              : ""
                          }
                          className="text-gray-900 bg-gray-200 px-1 rounded flex items-center"
                        >
                          + {overflowsCount[1]} ...
                        </div>
                      ))}
                    {responsiveMultiple &&
                      selectedLabels
                        .slice(
                          overflowsCount[1] > 0
                            ? overflowsCount[0] - 1
                            : overflowsCount[0],
                          overflowsCount[0] + overflowsCount[1] + 1
                        )
                        .map((label, i) =>
                          renderLabel ? (
                            <span className="opacity-0">
                              {renderLabel(label)}
                            </span>
                          ) : (
                            <span
                              key={i}
                              className={cn(
                                "text-gray-900 bg-gray-200 px-1 rounded items-center flex opacity-0",
                                {
                                  "py-1": size === "large",
                                  "bg-white": variant === "filled",
                                }
                              )}
                            >
                              {label}
                              <FaXmark className="fill-gray-400 hover:fill-gray-500" />
                            </span>
                          )
                        )}
                  </React.Fragment>
                ) : (
                  placeholder
                )
              ) : (
                (renderLabel &&
                  (selectedLabel.length > 0
                    ? renderLabel(selectedLabel)
                    : placeholder)) ||
                selectedLabel ||
                placeholder
              )}
            </div>
          )}
          <div className="flex gap-x-1 items-center">
            {mode === "multi" && maxSelect && (
              <div className="text-gray-400">
                {selectedLabels.length > 0 ? selectedLabels.length : 0}/
                {maxSelect}
              </div>
            )}
            <div>
              {!disabled &&
              clearable &&
              isMouseOver &&
              (selectedValue || selectedValues.length > 0) ? (
                <BsXCircle
                  onClick={handleClearSelection}
                  className="fill-gray-400 hover:fill-gray-500"
                />
              ) : loading ? (
                <VscLoading className="animate-spin fill-gray-400" />
              ) : searchable && !disabled && isOpen ? (
                <BsSearch className="fill-gray-400 hover:fill-gray-500" />
              ) : (
                <BsChevronDown
                  style={
                    isOpen
                      ? {
                          transform: "rotate(180deg)",
                          transition: "ease-in",
                          transitionDuration: ".3s",
                        }
                      : {
                          transition: "ease-in",
                          transitionDuration: ".3s",
                        }
                  }
                  className="fill-gray-400"
                />
              )}
            </div>
          </div>
        </div>
        {isOpen && (
          <div
            style={{
              transition: "height 0.5s ease-in-out, opacity 0.5s ease-in-out",
              animation: isOpen
                ? "slideDownFadeIn 0.5s ease-in-out forwards"
                : "slideUpFadeOut 0.5s ease-in-out backwards",
            }}
            className={cn(
              "absolute w-min min-w-48 rounded shadow  pt-1  my-8 ",
              PLACEMENT_CN[menuPlacement],
              {
                "my-7": size === "small",
                "my-9": size === "large",
              }
            )}
          >
            {renderOptions()}
          </div>
        )}
      </div>
    );
  }
);

export default Select2;
