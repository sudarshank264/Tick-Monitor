import { Vertical } from "@/lib/types/vertical.type";
import { Check, Close, FilterAlt } from "@mui/icons-material";
import { Menu, MenuItem } from "@mui/material";
import { useState } from "react";

export interface ProjectsFilterProps {
  anchRef: HTMLElement | null;
  options: string[];
  onChange: (curr: string, full: string[]) => void;
  onClose: () => void;
}

const ProjectsFilter = ({
  anchRef,
  options,
  onChange,
  onClose,
}: ProjectsFilterProps) => {
  const [filtered, setFiltered] = useState<string[]>([]);
  return (
    <Menu
      sx={{
        "& .MuiPaper-root": {
          width: "100%",
          maxWidth: 360,
          maxHeight: 400,
          overflow: "auto",
          borderRadius: 0,
        },
        "& .MuiMenuItem-root": {
          fontSize: "12px",
          height: "40px",
          gap: "1em",
        },
      }}
      open={Boolean(anchRef)}
      anchorEl={anchRef}
      onClose={onClose}
    >
      <div className=" flex items-center flex-wrap gap-2 my-2 px-4">
        {!filtered.length && (
          <div className="text-slate-400 text-sm h-7 flex gap-1">
            <FilterAlt />
            Applied Filters will appear here
          </div>
        )}
        {filtered.map((option, index) => (
          <div
            key={index}
            className="flex items-center justify-between rounded-full gap-2 h-7 w-[100px] px-2 bg-slate-800 text-white text-[10px]"
          >
            {option}
            <div
              className="cursor-pointer"
              onClick={() => {
                const filters = filtered.filter((o) => o !== option);
                setFiltered(filters);
                onChange("", filters);
              }}
            >
              <Close fontSize="small" />
            </div>
          </div>
        ))}
      </div>
      {options.map((option, index) => (
        <MenuItem
          onClick={() => {
            let newFilters = filtered;
            if (filtered.includes(option)) {
              newFilters = newFilters.filter((o) => o !== option);
            } else {
              newFilters = [...newFilters, option];
            }
            setFiltered(newFilters);
            onChange(option, newFilters);
          }}
          key={index}
        >
          {filtered.includes(option) ? <Check /> : null}
          {option}
        </MenuItem>
      ))}
    </Menu>
  );
};

export default ProjectsFilter;
