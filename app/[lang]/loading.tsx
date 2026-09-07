export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-cream/70 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <svg
          className="h-16 w-16 animate-spin text-plum"
          viewBox="0 0 50 50"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            className="opacity-20"
            cx="25"
            cy="25"
            r="20"
            stroke="currentColor"
            strokeWidth="6"
          />
          <path
            className="opacity-100"
            fill="currentColor"
            d="M43.94 25.03a18 18 0 10-8.12 13.74l2.36-3.9a14 14 0 11.79-2.09l2.97-7.76z"
          />
        </svg>

        <div className="text-center">
          <div className="mb-1 font-display text-lg text-ink">جارٍ التحميل</div>
          <div className="text-sm text-ink/60">لحظة بسيطة وسيتم التحميل...</div>
        </div>
      </div>
    </div>
  );
}
