import { useContext, useCallback } from "react";
import { SnackbarContext } from "../context/SnackbarContext";
import { SnackbarType } from "@/components/ui/Snackbar";

export default function useSnackbar() {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error("useSnackbar was called outside of SnackbarProvider");
  }
  const { dispatch } = context;
  return useCallback(
    (snack: SnackbarType) => {
      dispatch({ type: "ADD_SNACKBAR", payload: { current: snack } });
    },
    [dispatch]
  );
}
