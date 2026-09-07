"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

export default function Pagination({ totalPages }: { totalPages: number }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;

  if (totalPages <= 1) return null;

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  return (
    <div className="flex justify-center gap-2 mt-8 mb-16">
      {currentPage > 1 && (
        <Link
          href={createPageURL(currentPage - 1)}
          className="rounded-lg border border-line bg-white px-4 py-2 text-sm font-bold text-ink hover:bg-cream"
        >
          السابق
        </Link>
      )}

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <Link
          key={page}
          href={createPageURL(page)}
          className={`flex h-10 w-10 items-center justify-center rounded-lg border text-sm font-bold ${
            currentPage === page
              ? "border-plum bg-plum text-white"
              : "border-line bg-white text-ink hover:bg-cream"
          }`}
        >
          {page}
        </Link>
      ))}

      {currentPage < totalPages && (
        <Link
          href={createPageURL(currentPage + 1)}
          className="rounded-lg border border-line bg-white px-4 py-2 text-sm font-bold text-ink hover:bg-cream"
        >
          التالي
        </Link>
      )}
    </div>
  );
}
