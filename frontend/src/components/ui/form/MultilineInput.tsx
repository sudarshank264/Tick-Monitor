import {
  ChangeEventHandler,
  CSSProperties,
  DetailedHTMLProps,
  InputHTMLAttributes,
} from "react";

const MultilineInput = ({
  value,
  label,
  inputProps,
  hint,
  style,
  className,
  inputClassName,
  onChange,
}: {
  value?: string | number;
  label: string;
  hint: string;
  inputProps?: DetailedHTMLProps<
    InputHTMLAttributes<HTMLTextAreaElement>,
    HTMLTextAreaElement
  >;
  style?: CSSProperties;
  className?: string;
  inputClassName?: string;
  onChange?: ChangeEventHandler<HTMLTextAreaElement>;
}) => {
  return (
    <div
      className={`flex flex-col bg-white rounded-md w-full py-1 border border-slate-400 ${className}`}
    >
      <label className="text-xs px-2">{label}</label>
      <textarea
        className={`outline-none px-2 py-1 rounded-lg text-sm h-[100px] ${inputClassName}`}
        {...inputProps}
        style={{ fontSize: 13, ...style }}
        value={value}
        placeholder={hint}
        onChange={onChange}
      />
    </div>
  );
};

export default MultilineInput;
