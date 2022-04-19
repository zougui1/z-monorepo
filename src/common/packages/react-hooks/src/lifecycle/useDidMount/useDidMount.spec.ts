import { renderHook } from '@testing-library/react-hooks';

import { useDidMount } from './useDidMount';

const renderCurrentHook = () => {
  return renderHook(() => useDidMount());
}

describe('useDidMount()', () => {
  it('should return false on first render', () => {
    const { result } = renderCurrentHook();

    expect(result.current).toBe(false);
  });

  it('should return true after re-render', () => {
    const { result, rerender } = renderCurrentHook();
    rerender();

    expect(result.current).toBe(true);
  });
});
