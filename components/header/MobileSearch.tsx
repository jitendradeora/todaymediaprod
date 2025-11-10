'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { Input } from "../ui/input";

export function MobileSearch() {
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [mobileSearchQuery, setMobileSearchQuery] = useState("");
  const router = useRouter();

  const handleMobileSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (mobileSearchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(mobileSearchQuery)}`);
      setMobileSearchQuery("");
      setMobileSearchOpen(false);
    }
  };

  return (
    <>
      <button
        className="lg:hidden h-11 w-5 min-h-11 min-w-5 flex items-center justify-center"
        onClick={() => setMobileSearchOpen(true)}
        aria-label="فتح البحث"
      >
        <Search className="w-6 h-6" />
      </button>

      <Dialog open={mobileSearchOpen} onOpenChange={setMobileSearchOpen}>
        <DialogContent
          className="top-0 translate-y-0 max-w-full w-full rounded-none border-0 p-4 [&>button:not([data-custom-close])]:hidden"
          onInteractOutside={(e: any) => e.preventDefault()}
          onEscapeKeyDown={(e: any) => e.preventDefault()}
          aria-describedby="mobile-search-description"
        >
          <button
            onClick={() => setMobileSearchOpen(false)}
            data-custom-close
            className="absolute left-4 top-4 z-10 h-11 w-11 min-h-11 min-w-11 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            aria-label="إغلاق البحث"
          >
            <X className="w-6 h-6" />
          </button>
          <DialogHeader>
            <DialogTitle className="text-right">بحث</DialogTitle>
          </DialogHeader>
          <DialogDescription className="text-sm text-muted-foreground text-right">
            ابحث عن الأخبار التي تهمك
          </DialogDescription>
          <form onSubmit={handleMobileSearch} className="relative">
            <Input
              type="text"
              placeholder="ابحث عن الأخبار..."
              value={mobileSearchQuery}
              onChange={(e) => setMobileSearchQuery(e.target.value)}
              className="pr-10 pl-4 py-3 text-lg text-right"
              autoFocus
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-11 w-11 min-h-11 min-w-11 flex items-center justify-center text-muted-foreground"
              aria-label="بحث"
            >
              <Search className="w-5 h-5" />
            </button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
