'use client';

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "../ui/sheet";
import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { SocialIcons } from "./SocialIcons";

type Category = {
  name: string;
  path: string;
  subcategories?: Category[];
};

interface SocialLink {
  platform: string;
  url: string;
}

interface MobileMenuProps {
  categories: Category[];
  socialLinks?: SocialLink[];
}

export function MobileMenu({ categories, socialLinks }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <button 
          aria-label="فتح القائمة"
          className="h-11 w-11 min-h-11 min-w-11 flex items-center justify-center"
        >
          <Menu className="w-6 h-6" />
        </button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-[300px] sm:w-[400px] p-0 flex flex-col"
      >
        <SheetClose className="absolute right-auto left-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary z-50">
          <X className="h-6 w-6 text-white" />
          <span className="sr-only">إغلاق</span>
        </SheetClose>

        <div className="bg-gradient-to-b from-[#c90000] to-[#a00000] p-6 text-white">
          <h2 className="text-2xl text-right mb-2">القائمة الرئيسية</h2>
          <p className="text-sm text-white/80 text-right">تصفح الأقسام</p>
        </div>

        <nav className="flex-1 flex flex-col p-4 overflow-y-auto">
          <Accordion type="multiple" className="w-full">
            {categories.map((category, index) => {
              if (!category.subcategories) {
                return (
                  <Link
                    key={category.path}
                    href={category.path}
                    onClick={() => setIsOpen(false)}
                    className="text-lg py-3 px-4 hover:bg-accent rounded-lg transition-colors text-right border-b border-border flex items-center justify-between group"
                  >
                    <span className="group-hover:text-[#c90000] transition-colors">
                      {category.name}
                    </span>
                  </Link>
                );
              }

              return (
                <AccordionItem
                  key={category.path}
                  value={`item-${index}`}
                  className="border-b border-border"
                >
                  <AccordionTrigger className="text-lg py-3 px-4 hover:bg-accent hover:no-underline rounded-lg transition-colors text-right hover:text-[#c90000]">
                    {category.name}
                  </AccordionTrigger>
                  <AccordionContent className="pr-2">
                    <div className="flex flex-col">
                      <Link
                        href={category.path}
                        onClick={() => setIsOpen(false)}
                        className="py-2 px-6 text-right hover:bg-accent hover:text-[#c90000] transition-colors rounded"
                      >
                        الكل
                      </Link>

                      {category.subcategories.map((sub, subIndex) => {
                        if (!sub.subcategories) {
                          return (
                            <Link
                              key={sub.path}
                              href={sub.path}
                              onClick={() => setIsOpen(false)}
                              className="py-2 px-6 text-right hover:bg-accent hover:text-[#c90000] transition-colors rounded"
                            >
                              {sub.name}
                            </Link>
                          );
                        }

                        return (
                          <Accordion
                            key={sub.path}
                            type="multiple"
                            className="w-full"
                          >
                            <AccordionItem
                              value={`sub-${index}-${subIndex}`}
                              className="border-0"
                            >
                              <AccordionTrigger className="py-2 px-6 hover:bg-accent hover:no-underline rounded transition-colors text-right hover:text-[#c90000] text-base">
                                {sub.name}
                              </AccordionTrigger>
                              <AccordionContent className="pr-2">
                                <div className="flex flex-col">
                                  <Link
                                    href={sub.path}
                                    onClick={() => setIsOpen(false)}
                                    className="py-2 px-8 text-right hover:bg-accent hover:text-[#c90000] transition-colors rounded text-sm"
                                  >
                                    الكل
                                  </Link>

                                  {sub.subcategories?.map((subSub) => (
                                    <Link
                                      key={subSub.path}
                                      href={subSub.path}
                                      onClick={() => setIsOpen(false)}
                                      className="py-2 px-8 text-right hover:bg-accent hover:text-[#c90000] transition-colors rounded text-sm"
                                    >
                                      {subSub.name}
                                    </Link>
                                  ))}
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                        );
                      })}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </nav>

        <div className="border-t border-border p-4 bg-muted/30">
          <SocialIcons socialLinks={socialLinks} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
