'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative hidden md:block">
      <input
        type="text"
        placeholder="ابحث عن الأخبار..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="pr-10 pl-4 py-2 border border-border bg-input-background rounded-full w-64 focus:outline-none focus:ring-2 focus:ring-[#c90000] text-right"
      />
      <button
        type="submit"
        className="absolute right-2 top-1/2 -translate-y-1/2 h-11 w-11 min-h-11 min-w-11 flex items-center justify-center text-muted-foreground"
        aria-label="بحث"
      >
        <Search className="w-5 h-5" />
      </button>
    </form>
  );
}
