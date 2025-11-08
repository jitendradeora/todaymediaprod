import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";

interface SubMenuItem {
  name: string;
  path: string;
  subcategories?: SubMenuItem[];
}

interface MegaMenuSubmenuProps {
  item: SubMenuItem;
}

export function MegaMenuSubmenu({ item }: MegaMenuSubmenuProps) {
  const submenuRef = useRef<HTMLDivElement>(null);
  const [openToLeft, setOpenToLeft] = useState(false);

  useEffect(() => {
    const checkPosition = () => {
      if (submenuRef.current) {
        const rect = submenuRef.current.getBoundingClientRect();
        const windowWidth = window.innerWidth;
        
        // Check if opening to the left would cause overflow
        // If the submenu is in the left half of the screen, open to right
        // If in the right half, open to left
        const spaceOnLeft = rect.left;
        const spaceOnRight = windowWidth - rect.right;
        
        // If less than 250px space on right, open to left
        setOpenToLeft(spaceOnRight < 250);
      }
    };

    checkPosition();
    window.addEventListener('resize', checkPosition);
    return () => window.removeEventListener('resize', checkPosition);
  }, []);

  return (
    <div ref={submenuRef} className="relative group/sub">
      <Link
        href={item.path}
        className="block px-4 py-2.5 text-right hover:bg-accent hover:text-[#c90000] transition-colors flex items-center justify-between gap-2"
      >
        {item.subcategories && (
          <ChevronLeft className="w-4 h-4 flex-shrink-0" />
        )}
        <span className="flex-1">{item.name}</span>
      </Link>
      
      {/* Third Level Dropdown - Smart positioning */}
      {item.subcategories && (
        <div 
          className={`absolute top-0 bg-background border border-border shadow-xl min-w-[200px] opacity-0 invisible group-hover/sub:opacity-100 group-hover/sub:visible transition-all duration-200 pointer-events-none group-hover/sub:pointer-events-auto ${
            openToLeft 
              ? 'right-full mr-1' 
              : 'left-full ml-1'
          }`}
          style={{ zIndex: 9999 }}
        >
          {item.subcategories.map((subSub) => (
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
  );
}
