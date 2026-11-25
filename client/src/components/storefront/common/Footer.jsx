import stitchlaneLogo from "../../../assets/storefront/stitchlane.jpeg";
import { Link } from "../../../utils/storefront/router";

const footerLinks = [
  { name: "Home", path: "/" },
  { name: "Products", path: "/products" },
  { name: "About", path: "/about" },
  { name: "Contact", path: "/contact" },
];

export default function Footer() {
  return (
    <footer className="bg-[#4A250F] text-[#F8E9D2]">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-4 lg:px-12">
        <div>
          <div className="flex items-center gap-3">
            <img
              src={stitchlaneLogo}
              alt="StitchLane Logo"
              className="h-14 w-14 rounded-full object-cover"
            />
            <div>
              <h2 className="font-serif text-2xl">StitchLane</h2>
              <p className="text-[9px] tracking-[2px] text-[#D9BFA0]">
                THE ART OF STITCHING
              </p>
            </div>
          </div>
          <p className="mt-5 text-sm leading-7 text-[#D9BFA0]">
            Discover timeless handmade pieces and beautiful craftsmanship.
            Every stitch tells a story of elegance and care.
          </p>
        </div>

        <div>
          <h3 className="mb-5 font-serif text-xl">Quick Links</h3>
          <div className="flex flex-col gap-3 text-sm text-[#D9BFA0]">
            {footerLinks.map((link) => (
              <Link
                key={link.name}
                href={link.path}
                className="transition hover:text-white"
              >
                {link.name}
              </Link>
            ))}
            <Link href="/cart" className="hover:text-white">
              Shopping Cart
            </Link>
          </div>
        </div>

        <div>
          <h3 className="mb-5 font-serif text-xl">Customer Care</h3>
          <div className="flex flex-col gap-3 text-sm text-[#D9BFA0]">
            <Link href="/contact" className="hover:text-white">
              Contact Us
            </Link>
            <Link href="/checkout" className="hover:text-white">
              Cash on Delivery
            </Link>
            <p>Bahawalpur</p>
            <a href="tel:03121825417" className="hover:text-white">
              0312 1825417
            </a>
            <p>Nationwide shipping · Rs. 250</p>
          </div>
        </div>

        <div>
          <h3 className="mb-5 font-serif text-xl">Stay in Style</h3>
          <p className="mb-4 text-sm leading-6 text-[#D9BFA0]">
            Get updates about new collections and exclusive offers.
          </p>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex border-b border-[#D9BFA0]"
          >
            <input
              type="email"
              placeholder="Your email address"
              className="w-full bg-transparent py-3 text-sm text-white outline-none placeholder:text-[#B99A7A]"
            />
            <button
              type="submit"
              className="px-3 text-sm tracking-wider transition hover:text-white"
            >
              JOIN
            </button>
          </form>
        </div>
      </div>

      <div className="border-t border-[#755035]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-5 text-xs text-[#D9BFA0] sm:flex-row lg:px-12">
          <p>
            © {new Date().getFullYear()} The StitchLane. All rights reserved.
          </p>
          <p className="tracking-wider">MADE WITH LOVE & CARE</p>
        </div>
      </div>
    </footer>
  );
}
