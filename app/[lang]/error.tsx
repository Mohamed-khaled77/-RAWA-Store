"use client";

import { useEffect } from "react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Caught by ErrorBoundary:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-red-50 p-4 text-center">
      <h2 className="mb-4 text-2xl font-bold text-red-600">Something went wrong!</h2>
      <pre className="mb-6 max-w-[800px] overflow-auto rounded bg-white p-4 text-left text-sm shadow">
        {error.message}
        {"\n"}
        {error.stack}
      </pre>
      <button
        onClick={() => reset()}
        className="rounded bg-red-600 px-4 py-2 font-bold text-white hover:bg-red-700"
      >
        Try again
      </button>
    </div>
  );
}
