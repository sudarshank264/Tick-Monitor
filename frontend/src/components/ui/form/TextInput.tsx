import {
  CSSProperties,
  ChangeEventHandler,
  DetailedHTMLProps,
  InputHTMLAttributes,
} from "react";

const TextInput = ({
  value,
  label,
  inputProps,
  hint,
  style,
  className,
  inputClassName,
  onChange,
  icon,
}: {
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
  onChange?: ChangeEventHandler<HTMLInputElement>;
  icon?: React.ReactNode;
}) => {
  return (
    <div
      className={`flex flex-col bg-white rounded-md w-full py-1 border border-slate-400 ${className}`}
    >
      <label className="text-xs px-2">{label}</label>
      <div className="flex">
        <input
          className={`outline-none px-2 py-1 rounded-lg text-sm flex-grow ${inputClassName}`}
          {...inputProps}
          style={{ fontSize: 13, ...style }}
          value={value}
          placeholder={hint}
          onChange={onChange}
        />
        {icon}
      </div>
    </div>
  );
};

export default TextInput;
