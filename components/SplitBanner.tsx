

export default function SplitBanner() {
  return (
    <section className="mx-auto grid max-w-[1180px] grid-cols-1 gap-5 px-8 pb-24 md:grid-cols-2">
      <div className="relative flex min-h-[220px] flex-col justify-end overflow-hidden rounded-[20px] bg-gradient-to-br from-pink-500 to-pink-600 p-9">
        <span className="absolute -left-2 -top-2 text-[90px] opacity-25 drop-shadow-md">💄</span>
        <h3 className="mb-2 font-display text-3xl text-white">قسم البنات</h3>
        <p className="mb-4 text-[13px] text-white/75">
          ميك أب، إكسسوارات، مجوهرات، وكل حاجة بتفرق
        </p>
        <button className="w-fit rounded-xl bg-white px-6 py-3 text-sm font-bold text-ink">
          تصفح القسم
        </button>
      </div>

      <div className="relative flex min-h-[220px] flex-col justify-end overflow-hidden rounded-[20px] bg-gradient-to-br from-boys to-sky-600 p-9">
        <span className="absolute -left-2 -top-2 text-[90px] opacity-25 drop-shadow-md">🧢</span>
        <h3 className="mb-2 font-display text-3xl text-white">قسم الولاد</h3>
        <p className="mb-4 text-[13px] text-white/75">
          ساعات، كابات، محافظ، وإكسسوارات يومية
        </p>
        <button className="w-fit rounded-xl bg-white px-6 py-3 text-sm font-bold text-ink">
          تصفح القسم
        </button>
      </div>
    </section>
  );
}
