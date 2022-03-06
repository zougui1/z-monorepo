import { RouteComponent } from '../types';

export const processRouteTemplate = (pathname: string): RouteComponent[] => {
  const pathComponents = pathname
    .trim()
    .split('/')
    // removes empty strings which happens due to a trailing a slash
    .filter(Boolean)
    .map(pathComponent => {
      const isParam = pathComponent.startsWith(':');
      const isOptional = pathComponent.endsWith('?');

      const pathNameStart = isParam ? 1 : 0;
      const pathNameEnd = isOptional ? -1 : pathComponent.length;

      const pathName = pathComponent.slice(pathNameStart, pathNameEnd);

      return {
        name: pathName,
        isParam,
        isOptional,
      };
    });

  return pathComponents;
}
