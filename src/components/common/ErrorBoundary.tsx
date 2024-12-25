"use client";

import React from "react";

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps> {
  state = { hasError: false };

  static getDerivedStateFromError(error: any) {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("Error in Sidebar:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Terjadi masalah di Sidebar.</h1>;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
