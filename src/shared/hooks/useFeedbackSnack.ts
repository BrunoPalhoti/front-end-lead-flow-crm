import { useCallback, useState } from "react";

type SnackSeverity = "success" | "error";

interface SnackState {
  open: boolean;
  message: string;
  severity: SnackSeverity;
}

const initialSnack: SnackState = {
  open: false,
  message: "",
  severity: "success",
};

export function useFeedbackSnack() {
  const [snack, setSnack] = useState<SnackState>(initialSnack);

  const showSuccess = useCallback((message: string) => {
    setSnack({ open: true, message, severity: "success" });
  }, []);

  const showError = useCallback((message: string) => {
    setSnack({ open: true, message, severity: "error" });
  }, []);

  const closeSnack = useCallback(() => {
    setSnack((current) => ({ ...current, open: false }));
  }, []);

  return { snack, showSuccess, showError, closeSnack };
}
