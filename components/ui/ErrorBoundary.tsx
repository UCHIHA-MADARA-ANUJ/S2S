"use client";
import { Component, ReactNode } from "react";
import { AlertTriangle, RefreshCw, Home, Bug } from "lucide-react";
import Link from "next/link";

interface State { hasError: boolean; error?: Error; }

export class ErrorBoundary extends Component<{ children: ReactNode; fallback?: ReactNode; name?: string }, State> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: any) {
    if (typeof window !== "undefined") {
      // eslint-disable-next-line no-console
      console.error(`[ErrorBoundary${this.props.name ? `:${this.props.name}` : ""}]`, error, info);
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="min-h-[50vh] flex items-center justify-center p-6">
          <div className="glass-strong p-8 rounded-2xl max-w-md text-center">
            <div className="w-14 h-14 rounded-full bg-error/20 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-7 h-7 text-error" aria-hidden="true" />
            </div>
            <h2 className="font-display font-black text-2xl mb-2">Something went wrong</h2>
            <p className="text-text-secondary text-sm mb-6">
              {this.state.error?.message || "An unexpected error occurred."}
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <button onClick={() => this.setState({ hasError: false, error: undefined })} className="btn-primary text-sm">
                <RefreshCw className="w-3.5 h-3.5" /> Try Again
              </button>
              <Link href="/" className="btn-secondary text-sm">
                <Home className="w-3.5 h-3.5" /> Home
              </Link>
              <a href="mailto:anujphulera@gmail.com?subject=SkillVerse%20Bug" className="btn-secondary text-sm">
                <Bug className="w-3.5 h-3.5" /> Report
              </a>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
