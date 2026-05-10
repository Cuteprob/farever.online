"use client";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="container-page flex-center">
      <div className="text-center py-24 px-4">
        <h1 className="font-theme-display text-4xl font-bold text-primary mb-4">Something went wrong</h1>
        <p className="text-muted-foreground mb-8">An unexpected error occurred. Please try again.</p>
        <button onClick={reset} className="btn-primary">
          Try Again
        </button>
      </div>
    </div>
  );
}
