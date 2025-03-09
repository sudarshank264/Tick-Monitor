import { CSSProperties } from "react";
import { LineBreak } from "./LineBeak";

const SectionHeading = ({
  text,
  icon,
  className,
  style,
}: {
  icon?: React.ReactNode;
  text: string;
  className?: string;
  style?: CSSProperties;
}) => {
  return (
    <div style={style} className={`flex flex-col mx-4 mt-4 ${className}`}>
      <div className="flex font-bold items-center gap-1">
        {icon} {text}
      </div>
      <LineBreak className="mt-1 bg-secondary" />
    </div>
  );
};

export default SectionHeading;
