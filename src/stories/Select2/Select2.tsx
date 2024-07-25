import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Option, Select2Props } from "./types";
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

const Select2 = ({
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
  renderLabels,
  placement = "bottomLeft",
  responsiveMultiple,
  highlightOnHover = false,
}: Select2Props) => {
  const selectRef = useRef<HTMLDivElement>(null);
  const overflowRef = useRef<HTMLDivElement>(null);

  const [hasFocus, setHasFocus] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>("");
  const [selectedValue, setSelectedValue] = useState<string>("");
  const [selectedLabel, setSelectedLabel] = useState<string>("");
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [isMouseOver, setIsMouseOver] = useState<boolean>(false);
  const [flowCount, setFlowCount] = useState<number>(0);
  const [overflowCount, setOverflowCount] = useState<number>(0);

  useLayoutEffect(() => {
    const container = overflowRef.current;
    if (!container) return;
    const containerWidth = container.offsetWidth - 14;
    let currentWidth = 0;
    let flowCount = 0;
    let overflowCount = 0;

    const labels = container.querySelectorAll("span");

    for (let i = 0; i < selectedValues.length; i++) {
      const label = labels[i];
      if (label instanceof HTMLSpanElement) {
        currentWidth += label.offsetWidth + 4;
        console.log("containerWidth: " + containerWidth);
        console.log("currentWidth: " + currentWidth);
        if (currentWidth > containerWidth) {
          overflowCount++;
        } else {
          flowCount++;
        }
      }
    }
    overflowCount > 0 && overflowCount++;

    setFlowCount(flowCount);
    setOverflowCount(overflowCount);
    console.log("flowCount: " + flowCount);
    console.log("overflowCount: " + overflowCount);
  }, [selectedValues]);

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

  const toggleMenu = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      setHasFocus(true);
    }
  };
  const handleOptionClick = (
    value: string,
    label: string,
    optionDisabled?: boolean
  ) => {
    if (!optionDisabled && !disabled) {
      if (mode === "multi") {
        const selectedIndex = selectedValues.indexOf(value);
        if (selectedIndex === -1) {
          if (maxSelect && selectedValues.length >= maxSelect) {
            return;
          }
          setSelectedValues((prevValues) => [...prevValues, value]);
          setSelectedLabels((prevLabels) => [...prevLabels, label]);
          clearOnSelect && setSearchValue("");
        } else {
          const newSelectedValues = [...selectedValues];
          newSelectedValues.splice(selectedIndex, 1);
          setSelectedValues(newSelectedValues);

          const newSelectedLabels = [...selectedLabels];
          newSelectedLabels.splice(selectedIndex, 1);
          setSelectedLabels(newSelectedLabels);
        }
      } else {
        setSelectedValue(value);
        setSelectedLabel(label);
        setSearchValue("");
      }
      if (mode === "single") {
        setIsOpen(false);
      }
    }
  };

  const handleSelectAll = () => {
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
  };

  const handleClearSelection = (event: React.MouseEvent) => {
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
  };

  const handleClearOption = (event: React.MouseEvent, index: number) => {
    event.stopPropagation();
    if (!disabled) {
      const newSelectedValues = [...selectedValues];
      newSelectedValues.splice(index, 1);
      setSelectedValues(newSelectedValues);

      const newSelectedLabels = [...selectedLabels];
      newSelectedLabels.splice(index, 1);
      setSelectedLabels(newSelectedLabels);
    }
  };

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

    return (Object as any).groupBy(optionsToFilter, ({ category }) => category);
  }, [
    options,
    selectedValues,
    hideSelected,
    searchValue,
    selectedLabel,
    selectedLabels,
  ]);

  const renderOptions = () => {
    const filteredSearch = filteredOptions();
    if (!filteredSearch || Object.keys(filteredSearch).length === 0) {
      return (
        <div className="text-gray-500 text-sm flex flex-col gap-2 items-center justify-center text-nowrap py-5 px-2">
          <BsInbox size={32} />
          No data
        </div>
      );
    }

    return (
      <div
        className={cn("flex flex-col gap-y-1 py-2", {
          "max-h-48 overflow-y-auto scroll": (options?.length || 0) > 6,
        })}
      >
        {selectAll && mode === "multi" && (
          <span
            onClick={handleSelectAll}
            className={cn(
              "border-l-2 border-transparent hover:border-blue-500 text-gray-900 py-1 px-3 flex items-center gap-x-1 cursor-pointer hover:bg-gray-100",
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
                <MdOutlineCheckBox className="fill-blue-500" />
              ) : (
                <MdCheckBoxOutlineBlank className="fill-gray-300" />
              ))}
            Select All
          </span>
        )}
        {Object.entries(filteredOptions()).map((group: any) => {
          const [key, value]: [key: string, value: Option[]] = group;
          if (key !== "undefined") {
            return (
              <div className="text-gray-900 flex flex-col gap-y-1" key={key}>
                <div className="px-1 text-sm text-gray-500">{key}</div>
                {value.map((m) => (
                  <div
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
                        <MdOutlineCheckBox className="fill-blue-500" />
                      ) : (
                        <MdCheckBoxOutlineBlank className="fill-gray-300" />
                      ))}
                    {m.icon && m.icon}
                    {m.label}
                    <div className="truncate">{m.description}</div>
                  </div>
                ))}
              </div>
            );
          } else {
            return value.map((m) => (
              <div
                title={highlightOnHover ? m.label : ""}
                className={cn(
                  "px-2 border-l-2 border-transparent hover:border-l-blue-500 hover:bg-gray-100 cursor-pointer py-1 flex items-center gap-x-1 text-sm  whitespace-nowrap",
                  {
                    "bg-gray-100":
                      (selectedValue.includes(m.value) && mode === "single") ||
                      (selectedValues.includes(m.value) && mode === "multi"),
                    "bg-gray-200 hover:bg-gray-200 !cursor-not-allowed":
                      m.disabled,
                  }
                )}
                onClick={() => handleOptionClick(m.value, m.label, m.disabled)}
              >
                {mode === "multi" &&
                  multiCheckbox &&
                  (selectedValues.includes(m.value) ? (
                    <MdOutlineCheckBox className="fill-blue-500" />
                  ) : (
                    <MdCheckBoxOutlineBlank className="fill-gray-300" />
                  ))}
                {m.icon && m.icon}
                {m.label}
                <div className="truncate">{m.description}</div>
              </div>
            ));
          }
        })}
      </div>
    );
  };

  return (
    <div ref={selectRef} style={style} className="flex flex-col">
      {isOpen && (placement === "topRight" || placement === "topLeft") && (
        <div
          style={{
            transition: "height 0.5s ease-in-out, opacity 0.5s ease-in-out",
            animation: isOpen
              ? "slideDownFadeIn 0.5s ease-in-out forwards"
              : "slideUpFadeOut 0.5s ease-in-out backwards",
          }}
          className={cn(
            "relative w-min min-w-48 rounded shadow mb-1 pt-1",
            PLACEMENT_CN[placement || "topLeft"]
          )}
        >
          {renderOptions()}
        </div>
      )}
      {label && (
        <p
          className={cn(
            "text-xs text-gray-500 truncate w-min",
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
          "relative flex justify-between items-center gap-1 cursor-pointer text-sm border-none bg-white rounded text-gray-900 px-2",
          SIZE_CN[size || "medium"],
          VARIANT_CN[variant || "outlined"],
          STATUS_CN[status || "default"],
          {
            "!bg-white outline outline-1 ": isOpen && variant === "filled",
            "pl-1": mode === "multi" && selectedLabels.length > 0,
            "!bg-gray-200 hover:outline-gray-300 hover:cursor-not-allowed !text-gray-400":
              disabled,
            "!outline-blue-500": hasFocus,
          }
        )}
      >
        {searchable && !disabled ? (
          <div className="flex flex-wrap gap-1 cursor-text w-full">
            {mode === "multi" && selectedLabels && renderLabels
              ? renderLabels(selectedLabels)
              : selectedLabels.map((label, i) => (
                  <span
                    title={highlightOnHover ? label : ""}
                    key={i}
                    className={cn(
                      "text-gray-900 bg-gray-200 px-1 rounded flex items-center whitespace-nowrap cursor-default min-w-0",
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
                ))}
            <input
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
                  "placeholder:text-gray-900":
                    (mode === "single" && selectedLabel) ||
                    (mode === "multi" && selectedLabels.length > 0),
                }
              )}
            />
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
                renderLabels ? (
                  renderLabels(selectedLabels)
                ) : (
                  <React.Fragment>
                    {selectedLabels
                      .slice(
                        0,
                        responsiveMultiple
                          ? overflowCount > 0
                            ? flowCount - 1
                            : flowCount + 1
                          : selectedLabels.length
                      )
                      .map((label, i) => (
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
                      ))}

                    {overflowCount > 0 && (
                      <div
                        title={
                          highlightOnHover
                            ? selectedLabels
                                .slice(flowCount - 1, flowCount + overflowCount)
                                .map((l) => l)
                                .join(" ,")
                            : ""
                        }
                        className="text-gray-900 bg-gray-200 px-1 rounded flex items-center"
                      >
                        + {overflowCount} ...
                      </div>
                    )}
                    {responsiveMultiple &&
                      selectedLabels
                        .slice(
                          overflowCount > 0 ? flowCount - 1 : flowCount,
                          flowCount + overflowCount + 1
                        )
                        .map((label, i) => (
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
                        ))}
                  </React.Fragment>
                )
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
      {isOpen &&
        (placement === "bottomLeft" || placement === "bottomRight") && (
          <div
            style={{
              transition: "height 0.5s ease-in-out, opacity 0.5s ease-in-out",
              animation: isOpen
                ? "slideDownFadeIn 0.5s ease-in-out forwards"
                : "slideUpFadeOut 0.5s ease-in-out backwards",
            }}
            className={cn(
              "relative w-min min-w-48  rounded shadow mt-1 pt-1",
              PLACEMENT_CN[placement || "bottomLeft"]
            )}
          >
            {renderOptions()}
          </div>
        )}
    </div>
  );
};

export default Select2;
