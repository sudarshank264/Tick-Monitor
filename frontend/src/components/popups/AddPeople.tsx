import { People, Search } from "@mui/icons-material";
import { Avatar, Dialog, MenuItem, TextField } from "@mui/material";
import { LineBreak } from "../ui/LineBeak";
import { useState } from "react";
import TextInput from "../ui/form/TextInput";

const AddPeoplePopup = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const [people, setPeople] = useState([
    {
      domain: "OAB",
      name: "Subhadeep Chowdhury",
      id: "1",
    },
    {
      domain: "AntiMatter",
      name: "Avishek Neogi",
      id: "2",
    },
    {
      domain: "ABMCL",
      name: "Sumanth Kongani",
      id: "3",
    },
    {
      domain: "Grasim",
      name: "Mrityunjai Sinha",
      id: "4",
    },
  ]);
  const [selectedPepople, setSelectedPeople] = useState<
    {
      domain: string;
      name: string;
      id: number;
      role: string;
    }[]
  >([]);
  const [keyword, setKeyword] = useState("");
  return (
    <Dialog open={open} onClose={onClose}>
      <div className="px-4 pt-6 ">
        <div className="font-bold text-xl flex flex-col w-[480px] h-[360px]">
          <div className="flex justify-between">
            <div className="flex items-center gap-2">
              <People fontSize="small" />
              Add People
            </div>
            <div className="font-normal">
              <TextInput
                label=""
                hint="Search People "
                className="border-white"
                icon={<Search />}
              />
            </div>
          </div>
          <LineBreak className="mt-1 mb-2" />
          <div className="flex-grow">
            {people.map((p: any, index: any) => (
              <div
                key={index}
                onClick={() => {
                  setSelectedPeople((prev) => {
                    if (prev.filter((per) => per.id === p.id).length === 0) {
                      return [...prev, p];
                    }
                    return prev.filter((per) => per.id !== p.id);
                  });
                }}
                className={`text-sm font-normal flex py-3 px-2 my-2 rounded hover:bg-slate-200 cursor-pointer border justify-between ${
                  selectedPepople.filter((per) => per.id === p.id).length
                    ? " border-slate-500"
                    : ""
                }`}
              >
                <div className="mr-2 flex">
                  <Avatar>{p.name[0]}</Avatar>
                  <div className="flex flex-col ml-2">
                    <div className="font-bold text-md">{p.name}</div>
                    <div>{p.domain}</div>
                  </div>
                </div>
                {selectedPepople.filter((per) => per.id === p.id).length > 0 ? (
                  <div className="justify-self-end self-center">
                    <TextField
                      select
                      defaultValue={"Assist"}
                      size="small"
                      className="w-24"
                    >
                      <MenuItem value={"leader"}>Primary</MenuItem>
                      <MenuItem value={"Assist"}>Cc</MenuItem>
                    </TextField>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default AddPeoplePopup;
