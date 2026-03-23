export function TableSkeleton({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="space-y-3 animate-pulse">
      {/* Header */}
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {Array.from({ length: cols }).map((_, i) => (
          <div key={i} className="h-4 bg-muted rounded-lg" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="grid gap-4 py-3 border-b border-border" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
          {Array.from({ length: cols }).map((_, j) => (
            <div key={j} className="h-3 bg-muted rounded-lg" style={{ width: `${60 + Math.random() * 40}%` }} />
          ))}
        </div>
      ))}
    </div>
  );
}

export function CardSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-card border border-border rounded-2xl p-5 space-y-3">
          <div className="h-3 bg-muted rounded-lg w-2/3" />
          <div className="h-6 bg-muted rounded-lg w-1/2" />
        </div>
      ))}
    </div>
  );
}

export function ListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-3 animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl">
          <div className="w-10 h-10 bg-muted rounded-xl shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-3 bg-muted rounded-lg w-1/3" />
            <div className="h-2.5 bg-muted rounded-lg w-1/2" />
          </div>
          <div className="h-6 w-16 bg-muted rounded-full" />
        </div>
      ))}
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-muted rounded-2xl" />
        <div className="space-y-2">
          <div className="h-5 bg-muted rounded-lg w-32" />
          <div className="h-3 bg-muted rounded-lg w-24" />
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-card border border-border rounded-2xl p-4 space-y-2">
            <div className="h-6 bg-muted rounded-lg w-1/2 mx-auto" />
            <div className="h-3 bg-muted rounded-lg w-2/3 mx-auto" />
          </div>
        ))}
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-2xl p-5 space-y-3">
          <div className="h-4 bg-muted rounded-lg w-1/3" />
          <div className="h-3 bg-muted rounded-lg w-full" />
          <div className="h-3 bg-muted rounded-lg w-4/5" />
        </div>
        <div className="bg-card border border-border rounded-2xl p-5 space-y-3">
          <div className="h-4 bg-muted rounded-lg w-1/3" />
          <div className="h-3 bg-muted rounded-lg w-full" />
          <div className="h-3 bg-muted rounded-lg w-3/5" />
        </div>
      </div>
    </div>
  );
}
