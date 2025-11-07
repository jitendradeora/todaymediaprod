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
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={() => setMobileSearchOpen(true)}
        aria-label="فتح البحث"
      >
        <Search className="w-6 h-6" />
      </Button>

      <Dialog open={mobileSearchOpen} onOpenChange={setMobileSearchOpen}>
        <DialogContent
          className="top-0 translate-y-0 max-w-full w-full rounded-none border-0 p-4 [&>button]:hidden"
          onInteractOutside={(e: any) => e.preventDefault()}
          onEscapeKeyDown={(e: any) => e.preventDefault()}
          aria-describedby="mobile-search-description"
        >
          <button
            onClick={() => setMobileSearchOpen(false)}
            className="absolute left-4 top-4 z-10 text-muted-foreground hover:text-foreground transition-colors cursor-pointer !block"
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
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            >
              <Search className="w-5 h-5" />
            </button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
