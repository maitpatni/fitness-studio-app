import {
  Children,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

/**
 * Minimal hash router — zero external dependencies.
 * The preview is served from a sub-path, so hash routing is the correct strategy
 * (path-based routers 404 here). API-compatible with the react-router subset the
 * app uses: HashRouter, Routes, Route, Navigate, NavLink, Link, useNavigate,
 * useLocation, useParams.
 */

type LocationValue = { pathname: string };
type NavigateOpts = { replace?: boolean };

type RouterValue = {
  location: LocationValue;
  navigate: (to: string, opts?: NavigateOpts) => void;
};

const RouterCtx = createContext<RouterValue | null>(null);
const ParamsCtx = createContext<Record<string, string>>({});

function readHash(): LocationValue {
  const raw = window.location.hash.replace(/^#/, "");
  const pathname = raw.split("?")[0] || "/";
  return { pathname };
}

export function HashRouter({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useState<LocationValue>(readHash);

  useEffect(() => {
    const onChange = () => setLocation(readHash());
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);

  const navigate = useCallback((to: string, opts?: NavigateOpts) => {
    const path = to.startsWith("/") ? to : `/${to}`;
    if (opts?.replace) {
      window.history.replaceState(null, "", `#${path}`);
    } else {
      window.history.pushState(null, "", `#${path}`);
    }
    // Drive the update directly: pushState does not emit hashchange.
    setLocation(readHash());
  }, []);

  const value = useMemo(() => ({ location, navigate }), [location, navigate]);

  return <RouterCtx.Provider value={value}>{children}</RouterCtx.Provider>;
}

function useRouter(): RouterValue {
  const ctx = useContext(RouterCtx);
  if (!ctx) throw new Error("Router hooks must be used inside <HashRouter>");
  return ctx;
}

export function useNavigate() {
  return useRouter().navigate;
}

export function useLocation() {
  return useRouter().location;
}

export function useParams() {
  return useContext(ParamsCtx);
}

function matchPath(pattern: string, pathname: string): Record<string, string> | null {
  const ps = pattern.split("/").filter(Boolean);
  const xs = pathname.split("/").filter(Boolean);
  if (ps.length !== xs.length) return null;
  const params: Record<string, string> = {};
  for (let i = 0; i < ps.length; i += 1) {
    const p = ps[i] as string;
    const x = xs[i] as string;
    if (p.startsWith(":")) params[p.slice(1)] = decodeURIComponent(x);
    else if (p !== x) return null;
  }
  return params;
}

type RouteProps = { path: string; element: React.ReactNode };

/** Declarative marker consumed by <Routes>; never rendered on its own. */
export function Route(_props: RouteProps): null {
  return null;
}
Route.displayName = "HosRoute";

export function Routes({ children }: { children: React.ReactNode }) {
  const { location } = useRouter();
  const items = Children.toArray(children);

  let chosen: RouteProps | null = null;
  let params: Record<string, string> = {};

  for (const item of items) {
    const el = item as { props?: RouteProps } | null;
    if (!el || typeof el !== "object" || !el.props) continue;
    const path = el.props.path;
    if (path === "*") {
      if (!chosen) {
        chosen = el.props;
        params = {};
      }
      continue;
    }
    const m = matchPath(path, location.pathname);
    if (m) {
      chosen = el.props;
      params = m;
      break;
    }
  }

  if (!chosen) return null;
  return <ParamsCtx.Provider value={params}>{chosen.element}</ParamsCtx.Provider>;
}

export function Navigate({ to, replace }: { to: string; replace?: boolean }) {
  const navigate = useNavigate();
  useEffect(() => {
    navigate(to, { replace });
  }, [to, replace, navigate]);
  return null;
}

type AnchorProps = {
  to: string;
  className?: string | ((args: { isActive: boolean }) => string);
  children: React.ReactNode;
};

export function NavLink({ to, className, children }: AnchorProps) {
  const { location, navigate } = useRouter();
  const isActive = to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);
  const cls = typeof className === "function" ? className({ isActive }) : className;

  return (
    <a
      href={`#${to}`}
      className={cls}
      onClick={(e) => {
        e.preventDefault();
        navigate(to);
      }}
    >
      {children}
    </a>
  );
}

export function Link({ to, className, children }: AnchorProps) {
  const { navigate } = useRouter();
  return (
    <a
      href={`#${to}`}
      className={className}
      onClick={(e) => {
        e.preventDefault();
        navigate(to);
      }}
    >
      {children}
    </a>
  );
}
