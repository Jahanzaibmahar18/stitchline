import { useState } from "react";
import stitchlaneLogo from "../../../assets/storefront/stitchlane.jpeg";
import { Link, useRouter } from "../../../utils/storefront/router";
import { useCart } from "../../../context/storefront/CartContext";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Products", path: "/products" },
  { name: "About", path: "/about" },
  { name: "Contact", path: "/contact" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { count } = useCart();
  const { path } = useRouter();

  return (
    <header className="sticky top-0 z-50 border-b border-[#D9BFA0] bg-[#FAF3E8]/95 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
        <Link href="/" className="flex items-center gap-3">
          <img
            src={stitchlaneLogo}
            alt="The StitchLane"
            className="h-14 w-14 rounded-full object-cover"
          />
          <div>
            <h1 className="font-serif text-2xl font-semibold text-[#4A250F]">
              StitchLane
            </h1>
            <p className="text-[9px] tracking-[2px] text-[#98704C]">
              THE ART OF STITCHING
            </p>
          </div>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.path}
              className={`text-sm font-medium transition hover:text-[#A06A3C] ${
                path === link.path ? "text-[#A06A3C]" : "text-[#65432A]"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4 sm:gap-5">
          <Link
            href="/cart"
            className="relative inline-flex items-center gap-2 text-[#4A250F] transition hover:text-[#A06A3C]"
            aria-label={`Cart, ${count} items`}
          >
            <span className="relative inline-flex">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M6 7h12l1 14H5L6 7Z" />
                <path d="M9 7a3 3 0 0 1 6 0" />
              </svg>
              <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#4A250F] px-1 text-[10px] text-white">
                {count}
              </span>
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-[1.5px]">
              Cart
            </span>
          </Link>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-[#4A250F] md:hidden"
            aria-label="Toggle Menu"
          >
            {menuOpen ? (
              <span className="text-2xl">✕</span>
            ) : (
              <svg
                width="25"
                height="25"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
              >
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="border-t border-[#D9BFA0] bg-[#FAF3E8] px-6 py-5 md:hidden">
          <div className="flex flex-col gap-5">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.path}
                onClick={() => setMenuOpen(false)}
                className="text-sm font-medium text-[#65432A] transition hover:text-[#A06A3C]"
              >
                {link.name}
              </Link>
            ))}
            <Link
              href="/cart"
              onClick={() => setMenuOpen(false)}
              className="border-t border-[#D9BFA0] pt-4 text-sm font-medium"
            >
              Shopping Cart ({count})
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
