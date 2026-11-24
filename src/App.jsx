import AnnouncementBar from "./components/common/AnnouncementBar";
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import Home from "./components/pages/Home";
import Products from "./components/pages/Products";
import ProductDetail from "./components/pages/ProductDetail";
import About from "./components/pages/About";
import Contact from "./components/pages/Contact";
import Cart from "./components/pages/Cart";
import Checkout from "./components/pages/Checkout";
import { CartProvider } from "./context/CartContext";
import { Link, matchRoute, RouterProvider, useRouter } from "./utils/router";

function AppRoutes() {
  const { path } = useRouter();
  const route = matchRoute(path);

  switch (route.name) {
    case "home":
      return <Home />;
    case "products":
      return <Products />;
    case "product":
      return <ProductDetail id={route.id} />;
    case "about":
      return <About />;
    case "contact":
      return <Contact />;
    case "cart":
      return <Cart />;
    case "checkout":
      return <Checkout />;
    default:
      return (
        <main className="bg-[#FAF3E8] px-5 py-24 text-center text-[#4A250F]">
          <h1 className="font-serif text-4xl">Page not found</h1>
          <Link
            href="/"
            className="mt-6 inline-block border-b border-[#4A250F] pb-1 text-sm uppercase tracking-[1.5px]"
          >
            Return home
          </Link>
        </main>
      );
  }
}

export default function App() {
  return (
    <RouterProvider>
      <CartProvider>
        <div className="min-h-screen bg-[#FAF3E8] font-sans text-[#4A250F]">
          <Navbar />
          <AnnouncementBar />
          <AppRoutes />
          <Footer />
        </div>
      </CartProvider>
    </RouterProvider>
  );
}
