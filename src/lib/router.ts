import { useState, useEffect } from 'react';

export type Route =
  | '/'
  | '/stay'
  | '/gallery'
  | '/amenities'
  | '/area'
  | '/reviews'
  | '/policies'
  | '/about'
  | '/book'
  | '/confirmation'
  | `/reservation/${string}`;

export const useRouter = () => {
  const [currentRoute, setCurrentRoute] = useState<string>(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentRoute(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentRoute(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return { currentRoute, navigate };
};

export const matchRoute = (pattern: string, path: string): { match: boolean; params?: any } => {
  if (pattern === path) {
    return { match: true };
  }

  const patternParts = pattern.split('/');
  const pathParts = path.split('/');

  if (patternParts.length !== pathParts.length) {
    return { match: false };
  }

  const params: any = {};
  for (let i = 0; i < patternParts.length; i++) {
    if (patternParts[i].startsWith(':')) {
      const paramName = patternParts[i].slice(1);
      params[paramName] = pathParts[i];
    } else if (patternParts[i] !== pathParts[i]) {
      return { match: false };
    }
  }

  return { match: true, params };
};
