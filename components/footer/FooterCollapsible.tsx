'use client';

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";

interface FooterLink {
  href: string;
  label: string;
}

interface FooterCollapsibleProps {
  title: string;
  links: FooterLink[];
}

export function FooterCollapsible({ title, links }: FooterCollapsibleProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="text-right">
      {/* Mobile - Collapsible */}
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="md:hidden">
        <CollapsibleTrigger className="flex items-center justify-between w-full mb-4">
          <ChevronDown
            className={`w-5 h-5 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
          <h4>{title}</h4>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <ul className="space-y-2 text-sm pb-4">
            {links.map((link, index) => (
              <li key={`${link.href}-${index}`}>
                <Link
                  href={`/${link.href}`}
                  className="text-gray-400 hover:text-white block"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </CollapsibleContent>
      </Collapsible>

      {/* Desktop - Always Visible */}
      <div className="hidden md:block">
        <h4 className="mb-4">{title}</h4>
        <ul className="space-y-2 text-sm">
          {links.map((link, index) => (
            <li key={`${link.href}-${index}`}>
              <Link href={`/${link.href}`} className="text-gray-400 hover:text-white">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
