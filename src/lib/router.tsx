import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

/**
 * A deliberately tiny path router.
 *
 * Every route in this site is prerendered to a real `index.html` on disk, so
 * GitHub Pages can serve a direct hit or a hard refresh of any URL without a
 * redirect shim. This router exists only to make in-page navigation feel
 * instant after hydration; it is not load-bearing. With JavaScript disabled the
 * prerendered HTML is still complete and every link is a normal <a href>.
 */

const BASE = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');

/** Turns an app path ('/work/foo/') into a real href, honouring Vite's base. */
export function href(path: string): string {
  return `${BASE}${path}`;
}

/** Strips the base prefix off a browser pathname, normalising the trailing slash. */
export function toAppPath(pathname: string): string {
  let p = pathname;
  if (BASE && p.startsWith(BASE)) p = p.slice(BASE.length);
  if (!p.startsWith('/')) p = `/${p}`;
  if (!p.endsWith('/')) p = `${p}/`;
  return p;
}

interface RouterValue {
  path: string;
  navigate: (path: string) => void;
}

const RouterContext = createContext<RouterValue>({ path: '/', navigate: () => {} });

export function useRouter(): RouterValue {
  return useContext(RouterContext);
}

export function Router({ initialPath, children }: { initialPath: string; children: ReactNode }) {
  const [path, setPath] = useState(initialPath);

  const navigate = useCallback((next: string) => {
    window.history.pushState({}, '', href(next));
    setPath(next);
    // A route change is a new page: reset scroll and move focus to the top of
    // the document so keyboard and screen-reader users are not stranded
    // wherever the previous page happened to be.
    window.scrollTo({ top: 0, behavior: 'auto' });
    const main = document.getElementById('main');
    main?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    const onPop = () => setPath(toAppPath(window.location.pathname));
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const value = useMemo(() => ({ path, navigate }), [path, navigate]);
  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}

/**
 * An internal link. Renders a real anchor with a real href — the click handler
 * is a progressive enhancement, and modified clicks (new tab, middle click,
 * download) fall through to the browser untouched.
 */
export function Link({
  to,
  children,
  ...rest
}: { to: string; children: ReactNode } & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>) {
  const { navigate } = useRouter();

  return (
    <a
      href={href(to)}
      onClick={(event) => {
        if (event.defaultPrevented) return;
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        if (event.button !== 0) return;
        event.preventDefault();
        navigate(to);
      }}
      {...rest}
    >
      {children}
    </a>
  );
}
