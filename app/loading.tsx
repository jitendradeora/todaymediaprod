import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen">
      {/* Breaking News Bar skeleton */}
      <div className="bg-muted py-2">
        <div className="container mx-auto px-4">
          <Skeleton className="h-6 w-full" />
        </div>
      </div>

      {/* Hero Slider skeleton */}
      <section className="container mx-auto px-4 py-8">
        <Skeleton className="h-[600px] w-full rounded-2xl" />
      </section>

      {/* Content sections skeleton */}
      <div className="container mx-auto px-4 py-8 space-y-12">
        {[...Array(3)].map((_, sectionIndex) => (
          <div key={sectionIndex} className="space-y-6">
            <Skeleton className="h-8 w-48" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="h-48 w-full rounded-lg" />
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
