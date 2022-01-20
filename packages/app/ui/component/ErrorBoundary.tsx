import React from "react";
import { getSnackbar } from "../lib/globalMessage";

export class ErrorBoundary extends React.Component<any, { hasError: boolean }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    this.setState({
      hasError: true,
    });
    getSnackbar()?.(error.message || errorInfo || `Unexpected error`, {
      variant: "error",
    });
  }

  render() {
    // if (this.state.hasError) {
    //   return null;
    // }
    return this.props.children;
  }
}
