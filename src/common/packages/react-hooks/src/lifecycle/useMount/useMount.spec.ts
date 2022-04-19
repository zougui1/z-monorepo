import { renderHook } from '@testing-library/react-hooks';

import { useMount } from './useMount';

const renderCurrentHook = (props: { onMount: () => void }) => {
  return renderHook(({ onMount }) => useMount(onMount), {
    initialProps: props,
  });
}

describe('useMount()', () => {
  it('should call the onMount handler once', () => {
    const props = {
      onMount: jest.fn(),
    };

    renderCurrentHook(props);

    expect(props.onMount).toHaveBeenCalledTimes(1);
  });

  it('should not call the onMount handler on rerender', () => {
    const props = {
      onMount: jest.fn(),
    };

    const { rerender } = renderCurrentHook(props);

    props.onMount.mockReset();
    rerender();

    expect(props.onMount).not.toHaveBeenCalled();
  });

  it('should not call the onMount handler when it changes', () => {
    const props = {
      onMount: jest.fn(),
    };
    const newProps = {
      onMount: jest.fn(),
    };

    const { rerender } = renderCurrentHook(props);

    rerender(newProps);

    expect(newProps.onMount).not.toHaveBeenCalled();
  });
});
