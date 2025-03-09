"use client";

import { Breadcrumbs } from "@mui/material";
import { useEffect, useState } from "react";

const BreadcrumbsLinks = () => {
  const [paths, setPaths] = useState<string[]>([]);
  useEffect(() => {
    const path = window.location.pathname.split("/");
    setPaths(path);
  }, []);
  return (
    <div className="px-4 flex items-center justify-between text-2xl font-bold pt-2">
      <Breadcrumbs>
        {paths.slice(1).map((path, index) => (
          <div
            key={index}
            className="cursor-pointer capitalize text-xs font-extralight"
          >
            {path}
          </div>
        ))}
      </Breadcrumbs>
    </div>
  );
};
