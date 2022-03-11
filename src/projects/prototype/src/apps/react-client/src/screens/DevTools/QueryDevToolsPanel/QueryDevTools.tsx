import { ReactQueryDevtoolsPanel } from './ReactQueryDevToolsPanel'

export function QueryDevTools() {
  return (
    <aside
      aria-label="React DevTools"
      style={{
        height: '100%',
      }}
    >
      <ReactQueryDevtoolsPanel />
    </aside>
  );
}
