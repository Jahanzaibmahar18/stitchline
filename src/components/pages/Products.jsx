import { useMemo, useState } from "react";
import { products } from "../../data/products";
import ProductCard from "../common/ProductCard";

const filters = ["All", "Storage", "Kitchen"];

export default function Products() {
  const [active, setActive] = useState("All");

  const filtered = useMemo(() => {
    if (active === "All") return products;
    return products.filter((product) => product.category === active);
  }, [active]);

  return (
    <main className="bg-[#FAF3E8] text-[#4A250F]">
      <section className="border-b border-[#E4D2BA] bg-[#F4E8D8]">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-10 sm:py-20">
          <p className="mb-3 text-[10px] uppercase tracking-[3px] text-[#A87943]">
            Shop
          </p>
          <h1 className="font-serif text-4xl sm:text-6xl">All products</h1>
          <p className="mt-4 max-w-xl text-sm leading-7 text-[#80664E]">
            Explore The StitchLane collection — quilted storage pieces and
            kitchen warmers made for everyday elegance.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-10 sm:py-16">
        <div className="mb-10 flex flex-wrap gap-3">
          {filters.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setActive(filter)}
              className={`px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[1.5px] transition ${
                active === filter
                  ? "bg-[#4A250F] text-[#FAF3E8]"
                  : "border border-[#D9BFA0] text-[#65432A] hover:border-[#A87943]"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </main>
  );
}
