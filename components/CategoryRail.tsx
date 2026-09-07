export type RailCategory = { id: string; name: string; emoji: string };

export default function CategoryRail({
  categories,
  onSelect,
}: {
  categories: RailCategory[];
  onSelect?: (id: string | null) => void;
}) {
  return (
    <section className="mx-auto max-w-[1180px] px-8 pb-16 pt-5">
      <div className="mb-6 flex items-end justify-between">
        <h2 className="font-display text-3xl text-ink">
          هتلاقي كل حاجة هنا
        </h2>
        <p className="text-sm text-ink/55">{categories.length} أقسام رئيسية</p>
      </div>

      <div className="relative border-t-2 border-dashed border-line">
        <div className="flex gap-5 overflow-x-auto pb-1.5 pt-7">
          <button
            onClick={() => onSelect?.(null)}
            className="min-w-[128px] flex-none rounded-xl border border-line bg-white px-5 py-4 text-center text-sm font-bold hover:shadow-md"
            aria-label="عرض كل الأقسام"
          >
            الكل
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelect?.(cat.id)}
              className="relative min-w-[128px] flex-none rounded-xl border border-line bg-white px-5 py-4 text-center hover:shadow-md"
              aria-label={`قسم ${cat.name}`}
            >
              <div className="mb-2 text-2xl">{cat.emoji}</div>
              <div className="text-sm font-bold">{cat.name}</div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
