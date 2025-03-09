import {
  CrisisAlert,
  DensityMedium,
  LowPriority,
  PriorityHigh,
} from "@mui/icons-material";

export const urgencies = [
  {
    id: "0",
    value: "low",
    label: "Low",
    icon: <LowPriority fontSize="small" />,
    color: {
      backgroundColor: "#ecfccb",
      color: "#3f6212",
    },
  },
  {
    id: "1",
    value: "medium",
    label: "Medium",
    icon: <DensityMedium fontSize="small" />,
    color: {
      backgroundColor: "#bbf7d0",
      color: "#166534",
    },
  },
  {
    id: "2",
    value: "high",
    label: "High",
    icon: <PriorityHigh fontSize="small" />,
    color: {
      backgroundColor: "#fed7aa",
      color: "#3f6212",
    },
  },
  {
    id: "3",
    value: "critical",
    label: "Critical",
    icon: <CrisisAlert fontSize="small" />,
    color: {
      backgroundColor: "#fecaca",
      color: "#991b1b",
    },
  },
];
