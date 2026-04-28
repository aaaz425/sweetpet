import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertCircle, RotateCcw } from "lucide-react";
import { secondaryButtonClass } from "../ui";

type AppErrorBoundaryProps = {
  children: ReactNode;
};

type AppErrorBoundaryState = {
  hasError: boolean;
};

export class AppErrorBoundary extends Component<AppErrorBoundaryProps, AppErrorBoundaryState> {
  state: AppErrorBoundaryState = {
    hasError: false
  };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Unhandled UI error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="grid min-h-dvh place-items-center bg-background px-4 py-10 text-center text-text-primary">
          <section className="grid max-w-md justify-items-center gap-4 rounded-xl border border-border bg-surface p-6">
            <div className="grid h-12 w-12 place-items-center rounded-full bg-primary-soft text-primary">
              <AlertCircle className="h-6 w-6" aria-hidden="true" />
            </div>
            <div className="grid gap-2">
              <h1 className="text-xl font-bold">화면을 표시하지 못했습니다</h1>
              <p className="text-sm leading-6 text-text-secondary">
                예상하지 못한 오류가 발생했습니다. 새로고침하면 다시 시도할 수 있습니다.
              </p>
            </div>
            <button className={secondaryButtonClass} onClick={() => window.location.reload()} type="button">
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              새로고침
            </button>
          </section>
        </div>
      );
    }

    return this.props.children;
  }
}
