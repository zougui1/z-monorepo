import { renderHook } from '@testing-library/react-hooks';

import { useConst, UseConstOptions } from './useConst';

type HookProps<T> = {
  value: T;
  options?: UseConstOptions | undefined;
}

const renderCurrentHook = <T>(props: HookProps<T>) => {
  return renderHook(({ value, options }) => useConst(value, options), {
    initialProps: props,
  });
}

describe('useConst()', () => {
  const spies = {
    console: {
      log: jest.spyOn(console, 'log'),
      warn: jest.spyOn(console, 'warn'),
      info: jest.spyOn(console, 'info'),
      group: jest.spyOn(console, 'group'),
      groupEnd: jest.spyOn(console, 'groupEnd'),
    },
  };

  afterEach(() => {
    spies.console.log.mockReset();
    spies.console.warn.mockReset();
    spies.console.info.mockReset();
    spies.console.group.mockReset();
    spies.console.groupEnd.mockReset();
  });

  afterAll(() => {
    spies.console.log.mockRestore();
    spies.console.warn.mockRestore();
    spies.console.info.mockRestore();
    spies.console.group.mockRestore();
    spies.console.groupEnd.mockRestore();
  });

  describe('render with a primitive value', () => {
    const props: HookProps<string> = {
      value: 'my val',
    };

    describe('render once', () => {
      it('should return the value as is', () => {
        const { result } = renderCurrentHook(props);

        expect(result.current).toBe(props.value);
      });

      it('should not warn', () => {
        renderCurrentHook(props);

        expect(spies.console.log).not.toHaveBeenCalled();
        expect(spies.console.warn).not.toHaveBeenCalled();
        expect(spies.console.info).not.toHaveBeenCalled();
        expect(spies.console.group).not.toHaveBeenCalled();
        expect(spies.console.groupEnd).not.toHaveBeenCalled();
      });
    });

    describe('re-render with unchanged value', () => {
      it('should return the value as is', () => {
        const { result, rerender } = renderCurrentHook(props);
        rerender();

        expect(result.current).toBe(props.value);
      });

      it('should not warn', () => {
        const { rerender } = renderCurrentHook(props);
        rerender();

        expect(spies.console.log).not.toHaveBeenCalled();
        expect(spies.console.warn).not.toHaveBeenCalled();
        expect(spies.console.info).not.toHaveBeenCalled();
        expect(spies.console.group).not.toHaveBeenCalled();
        expect(spies.console.groupEnd).not.toHaveBeenCalled();
      });
    });

    describe('re-render with changed value', () => {
      const newProps = {
        value: 'new value',
      };

      it('should return the original value', () => {
        const { result, rerender } = renderCurrentHook(props);
        rerender(newProps);

        expect(result.current).toBe(props.value);
      });

      it('should warn that the constant value has changed', () => {
        const { rerender } = renderCurrentHook(props);
        rerender(newProps);

        expect(spies.console.group).toHaveBeenCalledTimes(1);
        expect(spies.console.group).toHaveBeenCalledWith('useConst');

        expect(spies.console.warn).toHaveBeenCalledTimes(1);
        expect(spies.console.warn).toHaveBeenCalledWith('The value used as a constant has changed');

        expect(spies.console.log).toHaveBeenCalledTimes(2);
        expect(spies.console.log).toHaveBeenCalledWith('Original value:', props.value);
        expect(spies.console.log).toHaveBeenCalledWith('New value:', newProps.value);

        expect(spies.console.info).toHaveBeenCalledTimes(1);
        expect(spies.console.info).toHaveBeenCalledWith('The value returned by useConst will not change');

        expect(spies.console.groupEnd).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('render with a lazy value', () => {
    const props: HookProps<() => string> = {
      value: () => 'my val',
      options: {
        warnOnChange: true,
      },
    };


    describe('render once', () => {
      it('should return the value returned by the function', () => {
        const { result } = renderCurrentHook(props);

        expect(result.current).toBe(props.value());
      });

      it('should not warn', () => {
        renderCurrentHook(props);

        expect(spies.console.log).not.toHaveBeenCalled();
        expect(spies.console.warn).not.toHaveBeenCalled();
        expect(spies.console.info).not.toHaveBeenCalled();
        expect(spies.console.group).not.toHaveBeenCalled();
        expect(spies.console.groupEnd).not.toHaveBeenCalled();
      });
    });

    describe('re-render with unchanged value', () => {
      it('should return the value as is', () => {
        const { result, rerender } = renderCurrentHook(props);
        rerender();

        expect(result.current).toBe(props.value());
      });

      it('should not warn', () => {
        const { rerender } = renderCurrentHook(props);
        rerender();

        expect(spies.console.log).not.toHaveBeenCalled();
        expect(spies.console.warn).not.toHaveBeenCalled();
        expect(spies.console.info).not.toHaveBeenCalled();
        expect(spies.console.group).not.toHaveBeenCalled();
        expect(spies.console.groupEnd).not.toHaveBeenCalled();
      });
    });

    describe('re-render with changed value', () => {
      const newProps: HookProps<() => string> = {
        ...props,
        value: () => 'new value',
      };

      it('should return the original value', () => {
        const { result, rerender } = renderCurrentHook(props);
        rerender(newProps);

        expect(result.current).toBe(props.value());
      });

      it('should warn that the constant value has changed', () => {
        const { rerender } = renderCurrentHook(props);
        rerender(newProps);

        expect(spies.console.group).toHaveBeenCalledTimes(1);
        expect(spies.console.group).toHaveBeenCalledWith('useConst');

        expect(spies.console.warn).toHaveBeenCalledTimes(1);
        expect(spies.console.warn).toHaveBeenCalledWith('The value used as a constant has changed');

        expect(spies.console.log).toHaveBeenCalledTimes(2);
        expect(spies.console.log).toHaveBeenCalledWith('Original value:', props.value);
        expect(spies.console.log).toHaveBeenCalledWith('New value:', newProps.value);

        expect(spies.console.info).toHaveBeenCalledTimes(1);
        expect(spies.console.info).toHaveBeenCalledWith('The value returned by useConst will not change');

        expect(spies.console.groupEnd).toHaveBeenCalledTimes(1);
      });
    });
  });
});
