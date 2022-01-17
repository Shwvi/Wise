import React from "react";
import { getSnackbar } from "../lib/globalMessage";

export class ErrorBoundary extends React.Component<any> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    getSnackbar()?.(error.message || errorInfo || `Unexpected error`, {
      variant: "error",
    });
  }

  render() {
    return this.props.children;
  }
}
