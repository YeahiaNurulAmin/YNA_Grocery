/**
 * Categories — horizontal category tiles on Home.
 * Navigates to /products/:category path from assets.categories.
 */
import { useNavigate } from "react-router-dom";
import { categories } from "../assets/assets";
import { SectionHeader } from "./ui";

const Categories = () => {
  const navigate = useNavigate();

  return (
    <section className="mt-16 md:mt-20">
      <SectionHeader
        eyebrow="Browse"
        title="Shop by category"
        subtitle="Fresh picks organized for faster grocery runs."
      />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3 md:gap-4">
        {categories.map((cat, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => {
              navigate(`/products/${cat.path.toLowerCase()}`);
              scrollTo(0, 0);
            }}
            className="group flex flex-col items-center gap-3 p-4 md:p-5 rounded-[24px] border border-border/50 bg-bg-white shadow-sm hover:shadow-md hover:-translate-y-1 hover:border-primary/25 transition-all duration-250 cursor-pointer text-center"
            style={{ background: `linear-gradient(180deg, ${cat.bgColor}88 0%, transparent 70%)` }}
          >
            <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center">
              <img
                src={cat.image}
                alt={cat.text}
                className="max-w-full max-h-full object-contain transition-transform duration-300 group-hover:scale-110"
              />
            </div>
            <span className="font-heading text-sm font-semibold text-text-primary leading-tight">
              {cat.text}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
};

export default Categories;
