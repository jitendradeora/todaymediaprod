'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { X, Eye } from 'lucide-react';

/**
 * Preview Banner Component
 * 
 * Displays a banner at the top of the page when in preview mode
 * Provides a button to exit preview mode
 */
export default function PreviewBanner() {
  const router = useRouter();
  const [isExiting, setIsExiting] = useState(false);

  const handleExit = async () => {
    setIsExiting(true);
    
    try {
      // Call the exit preview API
      await fetch('/api/preview/exit');
      
      // Redirect to homepage after exiting preview
      router.push('/');
    } catch (error) {
      console.error('Error exiting preview:', error);
      setIsExiting(false);
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-100 bg-orange-500 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <Eye className="w-5 h-5" />
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
              <span className="font-semibold text-sm sm:text-base">
                وضع المعاينة نشط
              </span>
              <span className="text-xs sm:text-sm opacity-90">
                أنت تشاهد محتوى غير منشور
              </span>
            </div>
          </div>

          <button
            onClick={handleExit}
            disabled={isExiting}
            className="flex items-center gap-2 px-4 py-2 bg-white text-orange-600 rounded-lg hover:bg-orange-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
          >
            {isExiting ? (
              <>
                <span className="animate-spin">⏳</span>
                <span className="hidden sm:inline">جارٍ الخروج...</span>
              </>
            ) : (
              <>
                <X className="w-4 h-4" />
                <span className="hidden sm:inline">إنهاء المعاينة</span>
                <span className="sm:hidden">إنهاء</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

