type LineBreakType = "invisible" | "solid";

export const LineBreak = ({
  type = "invisible",
  className,
}: {
  type?: LineBreakType;
  className?: string;
}) => {
  return <div className={`h-[1px] bg-slate-200 shadow-md ${className}`} />;
};

const SolidBreak = () => {
  return <div />;
};
