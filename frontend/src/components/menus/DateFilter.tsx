import { Vertical } from "@/lib/types/vertical.type";
import { Check, Close, FilterAlt } from "@mui/icons-material";
import { Menu, MenuItem } from "@mui/material";
import { ChangeEvent, useState } from "react";

export interface DateFilterProps {
  anchRef: HTMLElement | null;
  onChange: (curr: string, full: string[]) => void;
  onClose: () => void;
}

const DateFilter = ({ anchRef, onChange, onClose }: DateFilterProps) => {
  const [filtered, setFiltered] = useState<string[]>([]);
  const [date, setDate] = useState<string>("");
  const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value);
  };
  const addItem = () => {
    if (filtered.includes(date)) {
      return;
    }
    const filters = [...filtered, date];
    setFiltered(filters);
    onChange(date, filters);
  };
  return (
    <Menu
      sx={{
        "& .MuiPaper-root": {
          width: "100%",
          maxWidth: 360,
          maxHeight: 400,
          minHeight: 200,
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
        {filtered.map((option, index) => (
          <div
            key={index}
            className="flex items-center justify-between rounded-full gap-2 h-7 w-[120px] px-2 bg-slate-800 text-white text-[10px]"
          >
            {option}
            <div
              className="cursor-pointer"
              onClick={() => {
                const filters = filtered.filter((o) => o !== option);
                setFiltered(filters);
                onChange(date, filters);
              }}
            >
              <Close fontSize="small" />
            </div>
          </div>
        ))}
        <input
          type="date"
          onChange={handleDateChange}
          className="outline-none w-[100px] text-xs border-b border-slate-800"
          value={date}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              addItem();
            }
          }}
          placeholder="Enter Date you want to filter"
        />
        <div
          className="border border-slate-800 w-20 h-6 hover:bg-slate-200 flex text-sm rounded cursor-pointer text-slate-800 items-center justify-center"
          onClick={() => {
            addItem();
          }}
        >
          + Add
        </div>
      </div>
    </Menu>
  );
};

export default DateFilter;
