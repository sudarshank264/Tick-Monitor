"use client";

import Snackbar, { SnackbarType } from "@/components/ui/Snackbar";
import reducer, { TAction } from "@/lib/utils/reducer";
import { createContext, useCallback, useEffect, useReducer } from "react";

export const SnackbarContext = createContext<{
  queue: SnackbarType[];
  dispatch: React.Dispatch<TAction>;
}>({
  queue: [] as SnackbarType[],
  dispatch: () => {},
});

export default function SnackbarProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [{ queue }, dispatch] = useReducer(reducer, { queue: [] });
  const removeSnackbar = useCallback(
    (key: string) => {
      dispatch({ type: "REMOVE_SNACKBAR", payload: { key } });
    },
    [dispatch]
  );
  useEffect(() => {
    if (queue.length > 0) {
      const timer = setTimeout(() => {
        removeSnackbar(queue[0].key);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [queue, removeSnackbar]);
  return (
    <SnackbarContext.Provider value={{ queue, dispatch }}>
      {queue.map((snack, index) => (
        <Snackbar
          key={snack.key}
          className={`-mt-${index + 1} left-${index + 4}`}
          variant={snack.variant}
          icon={snack.icon}
          handleClose={() =>
            dispatch({ type: "REMOVE_SNACKBAR", payload: { key: snack.key } })
          }
          text={snack.text}
        />
      ))}
      {children}
    </SnackbarContext.Provider>
  );
}
