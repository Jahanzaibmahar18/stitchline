import { createContext, useContext, useEffect, useState } from "react";

const RouterContext = createContext(null);

function getPath() {
  return window.location.pathname || "/";
}

export function RouterProvider({ children }) {
  const [path, setPath] = useState(getPath);

  useEffect(() => {
    const onPop = () => setPath(getPath());
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const navigate = (to) => {
    if (to === path) return;
    window.history.pushState({}, "", to);
    setPath(to);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <RouterContext.Provider value={{ path, navigate }}>
      {children}
    </RouterContext.Provider>
  );
}

export function useRouter() {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error("useRouter must be used within RouterProvider");
  }
  return context;
}

export function Link({ href, className = "", children, onClick, ...props }) {
  const { navigate } = useRouter();

  return (
    <a
      href={href}
      className={className}
      onClick={(event) => {
        if (
          event.defaultPrevented ||
          event.button !== 0 ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey
        ) {
          return;
        }
        event.preventDefault();
        onClick?.(event);
        navigate(href);
      }}
      {...props}
    >
      {children}
    </a>
  );
}

export function matchRoute(path) {
  if (path === "/" || path === "") return { name: "home" };
  if (path === "/products") return { name: "products" };
  if (path === "/about") return { name: "about" };
  if (path === "/contact") return { name: "contact" };
  if (path === "/cart") return { name: "cart" };
  if (path === "/checkout") return { name: "checkout" };

  const productMatch = path.match(/^\/products\/([^/]+)$/);
  if (productMatch) return { name: "product", id: decodeURIComponent(productMatch[1]) };

  return { name: "notfound" };
}
