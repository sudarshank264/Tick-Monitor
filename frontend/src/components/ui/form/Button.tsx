import { CSSProperties } from "react";

type ButtonVariant = "contained" | "outlined" | "text";

interface ButtonProps {
  label: string;
  variant?: ButtonVariant;
  style?: CSSProperties;
  className?: string;
  onClick?: () => void;
}

const Button = ({ variant = "contained", ...props }: ButtonProps) => {
  switch (variant) {
    case "contained":
      return <ContainedButton {...props} />;
    case "text":
      return <TextButton {...props} />;
  }
};

const ContainedButton = (props: ButtonProps) => {
  return (
    <button
      {...props}
      className={`w-full bg-slate-900 h-12 text-white font-bold rounded-md ${props.className}`}
    >
      {props.label}
    </button>
  );
};

const TextButton = (props: ButtonProps) => {
  return (
    <button {...props} className={`text-sm font-[500] ${props.className}`}>
      {props.label}
    </button>
  );
};
export default Button;
