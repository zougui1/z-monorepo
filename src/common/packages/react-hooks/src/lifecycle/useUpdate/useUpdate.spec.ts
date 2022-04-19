import { renderHook } from '@testing-library/react-hooks';

import { useUpdate } from './useUpdate';

type HookProps = {
  onUpdate: () => void;
  dependencies: React.DependencyList;
}

const renderCurrentHook = (props: HookProps) => {
  return renderHook(({ onUpdate, dependencies }) => useUpdate(onUpdate, dependencies), {
    initialProps: props,
  });
}

describe('useUpdate()', () => {
  it('should not call the onUpdate handler after mounting once', () => {
    const props = {
      onUpdate: jest.fn(),
      dependencies: ['first value'],
    };

    renderCurrentHook(props);

    expect(props.onUpdate).not.toHaveBeenCalled();
  });

  it('should not call the onUpdate handler after re-rendering with unchanged dependencies', () => {
    const props = {
      onUpdate: jest.fn(),
      dependencies: ['first value'],
    };

    const { rerender } = renderCurrentHook(props);
    rerender();

    expect(props.onUpdate).not.toHaveBeenCalled();
  });

  it('should not call the onUpdate handler even if it changes as long as the dependencies remain unchanged', () => {
    const props = {
      onUpdate: jest.fn(),
      dependencies: ['first value'],
    };
    const newProps = {
      ...props,
      onUpdate: jest.fn(),
    };

    const { rerender } = renderCurrentHook(props);
    rerender(newProps);

    expect(newProps.onUpdate).not.toHaveBeenCalled();
  });

  it('should call the onUpdate handler when the dependencies change', () => {
    const props = {
      onUpdate: jest.fn(),
      dependencies: ['first value'],
    };
    const newProps = {
      ...props,
      dependencies: ['second value'],
    };

    const { rerender } = renderCurrentHook(props);
    rerender(newProps);

    expect(newProps.onUpdate).toHaveBeenCalledTimes(1);
  });
});
