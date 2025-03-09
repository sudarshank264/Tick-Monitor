/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  CSSProperties,
  DetailedHTMLProps,
  InputHTMLAttributes,
  useState,
  useEffect,
  useRef,
} from "react";

interface AutofillInputProps<T> {
  parentRef: React.RefObject<HTMLDivElement> | null;
  value?: string | number;
  label: string;
  hint: string;
  inputProps?: DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >;
  style?: CSSProperties;
  className?: string;
  inputClassName?: string;
  onChange?: (current: T, full: T[]) => void;
  icon?: React.ReactNode;
  renderAutofillItem: (
    item: T,
    highlighted: boolean,
    selectItem: (index: number) => void,
    idx: number
  ) => React.ReactNode;
  renderSelected: (
    sel: T,
    removeItem: (val: string) => void,
    idx: number
  ) => React.ReactNode;
  options: T[];
  searchMapper: (val: T) => string;
  maxItems?: number;
}

const AutofillInput = <T,>({
  value,
  label,
  hint,
  inputProps,
  style,
  className,
  inputClassName,
  onChange,
  icon,
  renderSelected,
  renderAutofillItem,
  options,
  parentRef,
  maxItems = Infinity,
}: AutofillInputProps<T>) => {
  const [inputValue, setInputValue] = useState(value || "");
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [selected, setSelected] = useState<any[]>([]);
  const [focused, setFocused] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [containerDimensions, setContainerDimensions] = useState<DOMRect>();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    setFilteredOptions(
      options.filter((option: any) =>
        inputValue === ""
          ? true
          : option.name
              .toString()
              .toLowerCase()
              .includes(inputValue.toString().toLowerCase())
      )
    );
    setHighlightedIndex(-1);
  }, [inputValue, options, focused]);

  const handleChange = (val: string) => {
    setInputValue(val);
  };

  const handleSelect = (option: T) => {
    console.log("ADD_OPTION", option);
    if (selected.length < maxItems && !selected.includes(option)) {
      const newSelected = [...selected, option];
      setSelected(newSelected);
      setInputValue("");
      setFilteredOptions(options);
      if (onChange) {
        onChange(option, newSelected);
      }
    } else {
      alert(`Maximum of ${maxItems} items can be selected.`);
    }
  };

  const handleFocus = () => {
    setTimeout(() => setFocused(true), 100);
  };

  const handleBlur = () => {
    setTimeout(() => {
      setFilteredOptions([]);
      setFocused(false);
    }, 500);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case "ArrowDown":
        setHighlightedIndex((prevIndex) =>
          prevIndex < filteredOptions.length - 1 ? prevIndex + 1 : prevIndex
        );
        break;
      case "ArrowUp":
        setHighlightedIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : 0));
        break;
      case "Enter":
        if (
          highlightedIndex >= 0 &&
          highlightedIndex < filteredOptions.length
        ) {
          handleSelect(filteredOptions[highlightedIndex]);
        }
        break;
      case "Escape":
        setFilteredOptions([]);
        break;
      default:
        break;
    }
  };
  const removeItem = (id: string) => {
    setSelected((prev) => {
      let newList = prev.filter((item) => item.id !== id);
      console.log("ON_REMOVE", newList);
      return newList;
    });
  };
  const selectItem = (idx: number) => {
    console.log("SELECTED: ", idx);
    handleSelect(filteredOptions[idx]);
  };
  const handleScroll = (): void => {
    console.log(containerRef.current?.getBoundingClientRect().top);
    setContainerDimensions(containerRef.current?.getBoundingClientRect());
  };
  useEffect(() => {
    setContainerDimensions(containerRef!.current!.getBoundingClientRect());
    parentRef?.current!.addEventListener("scroll", handleScroll);
    return () =>
      parentRef?.current?.removeEventListener("scroll", handleScroll);
  }, [containerRef.current]);

  return (
    <div
      ref={containerRef}
      className={`relative flex flex-col bg-white rounded-md w-full py-1 border border-slate-400 ${className}`}
    >
      <label className="text-xs px-2">{label}</label>
      <div className="flex flex-wrap gap-1">
        {selected.map((sel, idx) => renderSelected(sel, removeItem, idx))}
        {selected.length < maxItems ? (
          <>
            <input
              ref={inputRef}
              className={`outline-none px-2 py-1 rounded-lg text-sm flex-grow ${inputClassName}`}
              {...inputProps}
              style={{ fontSize: 13, ...style }}
              value={inputValue}
              placeholder={hint}
              onChange={(e) => handleChange(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleBlur}
              onFocus={handleFocus}
            />
            {icon}
          </>
        ) : (
          <></>
        )}
      </div>
      {focused && filteredOptions.length > 0 && selected.length < maxItems && (
        <div
          style={{
            // top: `${(containerDimensions?.top ?? 0) - 80}px`,
            top: `40px`,
            // width: `${containerDimensions?.width ?? 0 - 48}px`,
            width: `${containerDimensions?.width ?? 0 - 48}px`,
          }}
          className={`absolute animate-dropdown-appear-grow shadow-xl border border-slate-400 rounded-md z-50`}
        >
          {filteredOptions.map((option, idx) =>
            renderAutofillItem(
              option,
              highlightedIndex === idx,
              selectItem,
              idx
            )
          )}
        </div>
      )}
    </div>
  );
};

export default AutofillInput;
