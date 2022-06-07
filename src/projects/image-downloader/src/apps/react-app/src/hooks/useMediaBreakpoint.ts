import { useMediaQuery, Theme } from '@mui/material';

export const useMediaBreakpoint = (media: MediaBreakpoint): boolean => {
  const mediaParts = media.split(':');

  const matchKind: MediaQueryKind = !media.includes(':')
    ? 'only' as const
    : mediaParts[0] as MediaQueryKind;
  const breakpoint = mediaParts.at(-1) as Breakpoint;

  const matches = useMediaQuery<Theme>(theme => theme.breakpoints[matchKind](breakpoint));

  return matches;
}

export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type MediaQueryKind = 'only' | 'up' | 'down';
export type MediaBreakpoint = Breakpoint | `up:${Breakpoint}` | `down:${Breakpoint}`;
