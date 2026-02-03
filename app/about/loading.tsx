export default function AboutLoading() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <div className="space-y-12">
        {/* Header skeleton */}
        <div className="text-center space-y-4">
          <div className="h-12 w-64 bg-muted animate-pulse rounded mx-auto" />
          <div className="h-6 w-96 bg-muted animate-pulse rounded mx-auto" />
        </div>
        
        {/* Portrait skeleton */}
        <div className="w-64 h-80 mx-auto bg-muted animate-pulse rounded-lg" />
        
        {/* Bio skeleton */}
        <div className="space-y-6">
          <div className="h-6 bg-muted animate-pulse rounded w-full" />
          <div className="h-6 bg-muted animate-pulse rounded w-full" />
          <div className="h-6 bg-muted animate-pulse rounded w-5/6 mx-auto" />
        </div>
        
        {/* Philosophy skeleton */}
        <div className="bg-card rounded-lg p-8 space-y-4">
          <div className="h-8 bg-muted animate-pulse rounded w-48 mx-auto" />
          <div className="h-6 bg-muted animate-pulse rounded w-full" />
        </div>
      </div>
    </div>
  )
}
