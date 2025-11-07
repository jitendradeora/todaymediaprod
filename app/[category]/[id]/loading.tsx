import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <article className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Breadcrumb skeleton */}
      <div className="mb-6">
        <Skeleton className="h-5 w-64" />
      </div>

      {/* Category badge skeleton */}
      <div className="mb-4">
        <Skeleton className="h-6 w-24" />
      </div>

      {/* Title skeleton */}
      <div className="space-y-3 mb-6">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-4/5" />
      </div>

      {/* Meta info skeleton */}
      <div className="flex items-center gap-4 mb-6">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-48" />
        </div>
      </div>

      {/* Featured image skeleton */}
      <Skeleton className="h-[400px] w-full rounded-lg mb-8" />

      {/* Content skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>

      {/* Tags skeleton */}
      <div className="mt-8 flex flex-wrap gap-2">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-8 w-28" />
      </div>
    </article>
  );
}
