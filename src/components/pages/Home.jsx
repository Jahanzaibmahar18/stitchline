import { useEffect, useState } from "react";
import { Link } from "../../utils/router";
import { fetchProducts, products as fallbackProducts } from "../../data/products";
import ProductCard from "../common/ProductCard";
import mainimage from "../../assets/mainimage.png";

import bag5 from "../../assets/bag5.jpeg";
import bag7 from "../../assets/bag7.jpeg";
import image2 from "../../assets/image2.jpeg";

const reasons = [
  {
    title: "Hand-finished quality",
    text: "Every piece is carefully stitched for everyday beauty and lasting use.",
  },
  {
    title: "Thoughtful packaging",
    text: "Orders are wrapped with care so unboxing feels as special as the piece itself.",
  },
  {
    title: "Nationwide COD",
    text: "Cash on delivery across Pakistan with clear order updates from start to finish.",
  },
  {
    title: "Everyday elegance",
    text: "Storage and kitchen pieces designed to feel refined in real homes.",
  },
];

const moments = [
  {
    title: "Storage edits",
    subtitle: "Quilted totes for calm spaces",
    image: bag5,
  },
  {
    title: "Kitchen essentials",
    subtitle: "Warmers made for the table",
    image: image2,
  },
  {
    title: "Soft botanicals",
    subtitle: "Quiet prints, lasting craft",
    image: bag7,
  },
];

export default function Home() {
  const [featured, setFeatured] = useState(fallbackProducts.slice(0, 4));

  useEffect(() => {
    fetchProducts().then((items) => {
      if (items?.length) setFeatured(items.slice(0, 4));
    });
  }, []);

  return (
    <main className="bg-[#FAF3E8] text-[#4A250F]">
      <section className="relative flex min-h-[78vh] items-end overflow-hidden bg-[#2B1B10] sm:min-h-[88vh] sm:items-center">
        <img
          src={mainimage}
          alt="StitchLane boutique collection lifestyle"
          className="absolute inset-0 z-0 h-full w-full object-cover object-[center_35%] sm:object-center"
          loading="eager"
          fetchPriority="high"
        />
        <div className="absolute inset-0 z-[1] bg-gradient-to-r from-[#1D120B]/90 via-[#2B1B10]/55 to-[#2B1B10]/20 sm:via-[#2B1B10]/50" />
        <div className="absolute inset-0 z-[1] bg-gradient-to-t from-[#1D120B]/50 via-transparent to-[#1D120B]/15 sm:hidden" />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-16 pt-24 sm:px-10 sm:pb-24 sm:pt-28">
          <p className="mb-4 text-[11px] font-medium uppercase tracking-[3.5px] text-[#D6B477]">
            The StitchLane
          </p>
          <h1 className="max-w-2xl font-serif text-5xl leading-[1.05] text-[#FFF8EF] sm:text-6xl lg:text-7xl">
            Style with a
            <span className="mt-1 block italic text-[#D6B477]">story.</span>
          </h1>
          <p className="mt-6 max-w-md text-sm leading-7 text-[#E8D9C5] sm:text-base">
            Handcrafted storage and kitchen pieces made for everyday elegance —
            stitched with care in Pakistan.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/products"
              className="inline-flex items-center gap-3 bg-[#A87943] px-7 py-3.5 text-[10px] font-semibold uppercase tracking-[1.5px] text-white transition duration-300 hover:bg-[#C18A4B] sm:text-xs"
            >
              Shop collection
              <span aria-hidden="true">→</span>
            </Link>
            <Link
              href="/about"
              className="bg-[#FAF3E8] px-7 py-3.5 text-[10px] font-semibold uppercase tracking-[1.5px] text-[#4A250F] transition duration-300 hover:bg-[#D6B477] sm:text-xs"
            >
              Our story
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-[#E4D2BA] bg-[#F4E8D8]">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-10 gap-y-4 px-5 py-5 text-center sm:justify-between sm:px-10">
          <p className="text-[10px] uppercase tracking-[2px] text-[#765236]">
            Thoughtfully stitched pieces
          </p>
          <span className="hidden h-4 w-px bg-[#CBB08D] sm:block" />
          <p className="text-[10px] uppercase tracking-[2px] text-[#765236]">
            Cash on delivery across Pakistan
          </p>
          <span className="hidden h-4 w-px bg-[#CBB08D] sm:block" />
          <p className="text-[10px] uppercase tracking-[2px] text-[#765236]">
            From Bahawalpur
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-10 sm:py-24">
        <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="mb-3 text-[10px] uppercase tracking-[3px] text-[#A87943]">
              The StitchLane collection
            </p>
            <h2 className="font-serif text-3xl sm:text-5xl">
              Signature pieces
            </h2>
            <p className="mt-3 max-w-lg text-sm leading-7 text-[#80664E]">
              A curated edit of storage totes and kitchen warmers crafted for
              daily beauty.
            </p>
          </div>
          <Link
            href="/products"
            className="w-fit border-b border-[#A87943] pb-2 text-xs uppercase tracking-[1.5px] text-[#765236] transition hover:text-[#A87943]"
          >
            View all products →
          </Link>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-16 sm:px-10 sm:pb-24">
        <div className="mb-10">
          <p className="mb-3 text-[10px] uppercase tracking-[3px] text-[#A87943]">
            Find your favourite
          </p>
          <h2 className="font-serif text-3xl sm:text-5xl">
            A piece for every moment
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {moments.map((item, index) => (
            <Link href="/products" key={item.title} className="group relative block overflow-hidden">
              <img
                src={item.image}
                alt={item.title}
                className="h-[340px] w-full object-cover transition duration-700 group-hover:scale-105 sm:h-[420px]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#24180F]/70 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 p-6 sm:p-8">
                <p className="mb-2 text-[9px] uppercase tracking-[2px] text-[#E6C58D]">
                  0{index + 1} / Edit
                </p>
                <h3 className="font-serif text-2xl text-white sm:text-3xl">
                  {item.title}
                </h3>
                <p className="mt-2 text-xs text-[#F0E2D1]">{item.subtitle}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-[#EDE0CF]">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-16 sm:px-10 lg:grid-cols-2 lg:gap-20 lg:py-24">
          <div className="relative">
            <img
              src={bag5}
              alt="StitchLane geometric storage tote"
              className="h-[350px] w-full object-cover sm:h-[480px]"
            />
            <div className="absolute -bottom-5 -right-3 bg-[#4A250F] px-6 py-5 sm:-right-5 sm:px-9">
              <p className="font-serif text-xl italic text-[#D6B477]">
                Made with care
              </p>
            </div>
          </div>

          <div className="pt-5 lg:pt-0">
            <p className="mb-4 text-[10px] uppercase tracking-[3px] text-[#A87943]">
              A little about us
            </p>
            <h2 className="font-serif text-4xl leading-tight sm:text-5xl">
              Beauty in the
              <span className="block italic text-[#A87943]">little details.</span>
            </h2>
            <p className="mt-6 max-w-lg text-sm leading-8 text-[#80664E]">
              At The StitchLane, we believe style is more than what you keep —
              it is how a piece makes a home feel. Our collection brings
              thoughtful stitching, graceful prints, and everyday comfort
              together.
            </p>
            <Link
              href="/about"
              className="mt-8 inline-block border-b border-[#4A250F] pb-2 text-xs uppercase tracking-[1.5px] transition hover:text-[#A87943]"
            >
              Get to know us →
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-10 sm:py-24">
        <div className="mb-12 max-w-2xl">
          <p className="mb-3 text-[10px] uppercase tracking-[3px] text-[#A87943]">
            Why StitchLane
          </p>
          <h2 className="font-serif text-3xl sm:text-5xl">
            Premium craft. Trusted service.
          </h2>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map((reason) => (
            <div key={reason.title} className="border-t border-[#D9BFA0] pt-6">
              <h3 className="font-serif text-2xl">{reason.title}</h3>
              <p className="mt-3 text-sm leading-7 text-[#80664E]">{reason.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#4A250F] text-[#FAF3E8]">
        <div className="absolute inset-0 opacity-25">
          <img src={bag7} alt="" className="h-full w-full object-cover" />
        </div>
        <div className="relative mx-auto max-w-4xl px-5 py-20 text-center sm:px-10 sm:py-28">
          <p className="mb-4 text-[10px] uppercase tracking-[3px] text-[#D6B477]">
            Experience the craft
          </p>
          <h2 className="font-serif text-4xl leading-tight sm:text-5xl">
            Bring quiet luxury into everyday rituals
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-[#E8D9C5]">
            Explore hand-finished pieces designed for modern homes — then
            checkout with cash on delivery across Pakistan.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/products"
              className="bg-[#D6B477] px-7 py-3.5 text-[10px] font-semibold uppercase tracking-[1.5px] text-[#4A250F] transition hover:bg-[#FAF3E8] sm:text-xs"
            >
              Shop now
            </Link>
            <Link
              href="/contact"
              className="border border-[#D6B477]/50 px-7 py-3.5 text-[10px] font-semibold uppercase tracking-[1.5px] text-[#FAF3E8] transition hover:border-[#FAF3E8] sm:text-xs"
            >
              Contact us
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
