'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown, ChevronLeft } from "lucide-react";

type Category = {
  name: string;
  path: string;
  subcategories?: Category[];
};

export function StickyNav({ categories, logoUrl }: { categories: Category[]; logoUrl: string }) {
  const [isNavSticky, setIsNavSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const headerHeight = 200;
      const currentScrollY = window.scrollY;
      setIsNavSticky(currentScrollY > headerHeight);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`border-t border-border hidden lg:block bg-background transition-all duration-300 ${
        isNavSticky ? "fixed top-0 left-0 right-0 z-50 shadow-md" : "relative"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex gap-8 justify-start items-center overflow-visible">
          <Link
            href="/"
            className={`transition-all duration-300 ${
              isNavSticky ? "opacity-100 visible" : "opacity-0 invisible w-0"
            }`}
          >
            {isNavSticky && (
              <Image 
                src={logoUrl} 
                width={200} 
                height={80} 
                alt="اليوم ميديا" 
                className="h-12 w-auto object-contain" 
                priority
              />
            )}
          </Link>

          <div className="flex gap-8 justify-start overflow-visible">
            {categories.map((category, categoryIndex) => (
              <div key={category.path} className="relative group/main">
                <Link
                  href={category.path}
                  className="py-4 font-bold text-foreground hover:text-[#c90000] whitespace-nowrap transition-colors flex items-center gap-1"
                >
                  {category.name}
                  {category.subcategories && <ChevronDown className="w-4 h-4" />}
                </Link>

                {category.subcategories && (
                  <div
                    className="absolute top-full right-0 mt-0 bg-background border border-border shadow-xl min-w-[220px] opacity-0 invisible group-hover/main:opacity-100 group-hover/main:visible transition-all duration-200 pointer-events-none group-hover/main:pointer-events-auto"
                    style={{ zIndex: 9999 }}
                  >
                    {category.subcategories.map((sub, subIndex) => (
                      <div key={sub.path} className="relative group/sub">
                        <Link
                          href={sub.path}
                          className="block px-4 py-2.5 text-right hover:bg-accent hover:text-[#c90000] transition-colors flex items-center justify-between gap-2"
                        >
                          {sub.subcategories && (
                            <ChevronLeft className="w-4 h-4 flex-shrink-0" />
                          )}
                          <span className="flex-1">{sub.name}</span>
                        </Link>

                        {sub.subcategories && (
                          <div
                            className={`absolute top-0 bg-background border border-border shadow-xl min-w-[200px] opacity-0 invisible group-hover/sub:opacity-100 group-hover/sub:visible transition-all duration-200 pointer-events-none group-hover/sub:pointer-events-auto ${
                              categoryIndex < 2 ? "left-full ml-1" : "right-full mr-1"
                            }`}
                            style={{ zIndex: 9999 }}
                          >
                            {sub.subcategories.map((subSub) => (
                              <Link
                                key={subSub.path}
                                href={subSub.path}
                                className="block px-4 py-2.5 text-right hover:bg-accent hover:text-[#c90000] transition-colors"
                              >
                                {subSub.name}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
