import { renderHook } from '@testing-library/react-hooks';

import { useId } from './useId';

type HookProps = {
  id?: string | undefined;
}

const renderCurrentHook = <T>(props: HookProps) => {
  return renderHook(({ id }) => useId(id), {
    initialProps: props,
  });
}

describe('useId()', () => {
  describe('render without giving an ID', () => {
    const props: HookProps = {};

    describe('render once', () => {
      it('should return a random string', () => {
        const { result } = renderCurrentHook(props);

        expect(result.current).toStrictEqual(expect.any(String));
      });
    });

    describe('re-render', () => {
      it('should return the same ID', () => {
        const { result, rerender } = renderCurrentHook(props);

        const firstId = result.current;

        rerender();

        expect(result.current).toBe(firstId);
      });
    });
  });

  describe('render with an ID', () => {
    const props: HookProps = {
      id: 'first ID',
    };

    describe('render once', () => {
      it('should return the given ID', () => {
        const { result } = renderCurrentHook(props);

        expect(result.current).toBe(props.id);
      });
    });

    describe('re-render', () => {
      it('should return the same ID', () => {
        const { result, rerender } = renderCurrentHook(props);
        rerender();

        expect(result.current).toBe(props.id);
      });
    });

    describe('re-render with different ID', () => {
      const newProps: HookProps = {
        id: 'second ID',
      };

      it('should return the new ID', () => {
        const { result, rerender } = renderCurrentHook(props);
        rerender(newProps);

        expect(result.current).toBe(newProps.id);
      });
    });

    describe('re-render without ID', () => {
      const newProps: HookProps = {};

      it('should return a generated ID', () => {
        const { result, rerender } = renderCurrentHook(props);
        rerender(newProps);

        expect(result.current).toStrictEqual(expect.any(String));
        expect(result.current).not.toBe(props.id);
      });
    });
  });
});
