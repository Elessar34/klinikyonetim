"use client";

import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation, faRotateRight } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

function ErrorFallback({ error, onReset }: { error: Error | null; onReset: () => void }) {
  return (
    <div className="flex items-center justify-center min-h-[300px] p-8">
      <div className="text-center space-y-4 max-w-md">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-destructive/10 flex items-center justify-center">
          <FontAwesomeIcon icon={faTriangleExclamation} className="text-destructive text-2xl" />
        </div>
        <h3 className="text-lg font-bold">Bir Hata Oluştu</h3>
        <p className="text-sm text-muted-foreground">
          Beklenmeyen bir hata meydana geldi. Lütfen sayfayı yenileyin veya daha sonra tekrar deneyin.
        </p>
        {process.env.NODE_ENV === "development" && error && (
          <div className="bg-muted rounded-xl p-3 text-left">
            <p className="text-xs font-mono text-destructive break-all">{error.message}</p>
          </div>
        )}
        <div className="flex gap-3 justify-center">
          <Button variant="outline" className="rounded-xl gap-2" onClick={onReset}>
            <FontAwesomeIcon icon={faRotateRight} /> Tekrar Dene
          </Button>
          <Button variant="outline" className="rounded-xl" onClick={() => window.location.href = "/panel/dashboard"}>
            Ana Sayfa
          </Button>
        </div>
      </div>
    </div>
  );
}

// React Error Boundary as a wrapper using hooks pattern
export default function ErrorBoundaryWrapper({ children, fallback }: ErrorBoundaryProps) {
  const [state, setState] = useState<ErrorBoundaryState>({ hasError: false, error: null });

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      event.preventDefault();
      setState({ hasError: true, error: event.error || new Error(event.message) });
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      event.preventDefault();
      setState({ hasError: true, error: new Error(String(event.reason)) });
    };

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleUnhandledRejection);

    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleUnhandledRejection);
    };
  }, []);

  if (state.hasError) {
    if (fallback) return <>{fallback}</>;
    return <ErrorFallback error={state.error} onReset={() => setState({ hasError: false, error: null })} />;
  }

  return <>{children}</>;
}
