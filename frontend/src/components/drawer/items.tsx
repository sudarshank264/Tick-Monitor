import { colorTheme } from "@/lib/utils/colors";
import { ArrowRightAlt } from "@mui/icons-material";

const DrawerItem = ({
  label,
  selected,
  icon,
}: {
  label: string;
  selected?: boolean;
  icon: JSX.Element;
}) => {
  return (
    <>
      <div
        className={`h-16 m-1 rounded flex flex-col items-center justify-center cursor-pointer ${
          selected ? `` : ` hover:bg-[#ffffff40]`
        }`}
      >
        <div
          className={`flex flex-col items-center justify-center font-normal scale-90 text-xs gap-2 ${
            selected ? "text-highlight" : "text-secondary"
          }`}
        >
          <div className="w-6 h-6">{icon}</div>
          {label}
        </div>
        <div></div>
      </div>
    </>
  );
};

export default DrawerItem;
