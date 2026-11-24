import { useState } from "react";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="bg-[#FAF3E8] text-[#4A250F]">
      <section className="border-b border-[#E4D2BA] bg-[#F4E8D8]">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-10 sm:py-20">
          <p className="mb-3 text-[10px] uppercase tracking-[3px] text-[#A87943]">
            Contact
          </p>
          <h1 className="font-serif text-4xl sm:text-6xl">Let&apos;s talk</h1>
          <p className="mt-4 max-w-xl text-sm leading-7 text-[#80664E]">
            Questions about an order, product sizing, or custom requests? We are
            happy to help.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-10 lg:grid-cols-[0.9fr_1.1fr] lg:py-24">
        <div className="space-y-8">
          <div>
            <h2 className="font-serif text-2xl">Visit & reach us</h2>
            <p className="mt-3 text-sm leading-7 text-[#80664E]">
              Johar Town, Lahore, Pakistan
            </p>
          </div>
          <div>
            <h3 className="text-[11px] uppercase tracking-[2px] text-[#A87943]">
              Delivery
            </h3>
            <p className="mt-2 text-sm leading-7 text-[#80664E]">
              Cash on delivery available across Pakistan. Most orders arrive in
              2–5 working days.
            </p>
          </div>
          <div>
            <h3 className="text-[11px] uppercase tracking-[2px] text-[#A87943]">
              Support
            </h3>
            <p className="mt-2 text-sm leading-7 text-[#80664E]">
              Use the form to reach us with order questions, custom requests, or
              product details. We reply as soon as we can.
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="border border-[#E4D2BA] bg-[#FFF9F1] p-6 sm:p-8"
        >
          {submitted ? (
            <div className="py-10 text-center">
              <h2 className="font-serif text-3xl">Message sent</h2>
              <p className="mt-3 text-sm text-[#80664E]">
                Thank you — we will get back to you shortly.
              </p>
            </div>
          ) : (
            <>
              <h2 className="font-serif text-3xl">Send a message</h2>
              <div className="mt-8 grid gap-5">
                <label className="block">
                  <span className="mb-2 block text-[11px] uppercase tracking-[1.5px] text-[#98704C]">
                    Name
                  </span>
                  <input
                    required
                    name="name"
                    className="w-full border border-[#D9BFA0] bg-transparent px-4 py-3 text-sm outline-none transition focus:border-[#A87943]"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-[11px] uppercase tracking-[1.5px] text-[#98704C]">
                    Email
                  </span>
                  <input
                    required
                    type="email"
                    name="email"
                    className="w-full border border-[#D9BFA0] bg-transparent px-4 py-3 text-sm outline-none transition focus:border-[#A87943]"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-[11px] uppercase tracking-[1.5px] text-[#98704C]">
                    Message
                  </span>
                  <textarea
                    required
                    name="message"
                    rows={5}
                    className="w-full resize-y border border-[#D9BFA0] bg-transparent px-4 py-3 text-sm outline-none transition focus:border-[#A87943]"
                  />
                </label>
              </div>
              <button
                type="submit"
                className="mt-6 bg-[#4A250F] px-7 py-3.5 text-[11px] font-semibold uppercase tracking-[1.5px] text-[#FAF3E8] transition hover:bg-[#A87943]"
              >
                Send message
              </button>
            </>
          )}
        </form>
      </section>
    </main>
  );
}
