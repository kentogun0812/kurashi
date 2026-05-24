export function ProcedureSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="flex flex-col justify-between rounded-2xl border border-border bg-card p-6 h-[250px]"
        >
          <div>
            {/* Category badge skeleton */}
            <div className="mb-4 flex items-center justify-between">
              <div className="h-6 w-24 rounded-xl bg-muted" />
              <div className="h-4 w-16 rounded-lg bg-muted" />
            </div>

            {/* Title skeleton */}
            <div className="mb-3 space-y-2">
              <div className="h-5 w-5/6 rounded-lg bg-muted" />
              <div className="h-5 w-3/4 rounded-lg bg-muted" />
            </div>

            {/* Summary skeleton */}
            <div className="mt-4 space-y-2">
              <div className="h-3 w-full rounded-md bg-muted" />
              <div className="h-3 w-full rounded-md bg-muted" />
              <div className="h-3 w-2/3 rounded-md bg-muted" />
            </div>
          </div>

          {/* Footer skeleton */}
          <div className="flex items-center justify-between border-t border-border/50 pt-4 mt-auto">
            <div className="h-3 w-28 rounded-md bg-muted" />
            <div className="h-3 w-16 rounded-md bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}
