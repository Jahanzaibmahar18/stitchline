import { Link } from "../../utils/router";
import bag7 from "../../assets/bag7.jpeg";
import image2 from "../../assets/image2.jpeg";

export default function About() {
  return (
    <main className="bg-[#FAF3E8] text-[#4A250F]">
      <section className="border-b border-[#E4D2BA] bg-[#F4E8D8]">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-10 sm:py-20">
          <p className="mb-3 text-[10px] uppercase tracking-[3px] text-[#A87943]">
            Our story
          </p>
          <h1 className="font-serif text-4xl sm:text-6xl">
            The art of stitching
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-8 text-[#80664E]">
            The StitchLane began with a love for thoughtful handmade pieces —
            soft storage, kitchen essentials, and quiet details that make a home
            feel finished.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-16 sm:px-10 lg:grid-cols-2 lg:gap-16 lg:py-24">
        <img
          src={bag7}
          alt="Wildflower linen storage piece"
          className="h-[360px] w-full object-cover sm:h-[480px]"
        />
        <div>
          <h2 className="font-serif text-3xl sm:text-4xl">
            Crafted for everyday living
          </h2>
          <p className="mt-5 text-sm leading-8 text-[#80664E]">
            We design pieces that look refined and work hard — quilted storage
            totes for calm spaces, insulated warmers for the table, and prints
            chosen to feel warm, timeless, and personal.
          </p>
          <p className="mt-4 text-sm leading-8 text-[#80664E]">
            Based in Johar Town, Lahore, we ship nationwide with cash on
            delivery so shopping stays simple and trusted.
          </p>
        </div>
      </section>

      <section className="bg-[#EDE0CF]">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-16 sm:px-10 lg:grid-cols-2 lg:gap-16 lg:py-24">
          <div className="order-2 lg:order-1">
            <h2 className="font-serif text-3xl sm:text-4xl">
              Beauty in the little details
            </h2>
            <p className="mt-5 text-sm leading-8 text-[#80664E]">
              From diamond quilting to lace trim and carefully finished seams,
              every StitchLane piece is made to feel considered. Our cream,
              chocolate, beige, and antique gold world reflects the soft luxury
              of handmade textiles.
            </p>
            <Link
              href="/products"
              className="mt-8 inline-block border-b border-[#4A250F] pb-2 text-xs uppercase tracking-[1.5px] transition hover:text-[#A87943]"
            >
              Explore the collection →
            </Link>
          </div>
          <img
            src={image2}
            alt="Gingham roti warmer"
            className="order-1 h-[360px] w-full object-cover sm:h-[480px] lg:order-2"
          />
        </div>
      </section>
    </main>
  );
}
