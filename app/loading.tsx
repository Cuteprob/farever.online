export default function Loading() {
  return (
    <div className="container-page">
      <div className="container mx-auto max-w-7xl px-4 py-16">
        <div className="space-y-8 animate-pulse">
          {/* Hero skeleton */}
          <div className="rounded-2xl bg-theme-dark-800 p-10">
            <div className="h-6 w-40 bg-theme-dark-700 rounded-full mb-4" />
            <div className="h-12 w-96 max-w-full bg-theme-dark-700 rounded-lg mb-4" />
            <div className="h-5 w-80 max-w-full bg-theme-dark-700 rounded mb-2" />
            <div className="h-5 w-64 max-w-full bg-theme-dark-700 rounded" />
          </div>
          {/* Content skeletons */}
          <div className="grid gap-4 sm:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-40 rounded-2xl bg-theme-dark-800" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
