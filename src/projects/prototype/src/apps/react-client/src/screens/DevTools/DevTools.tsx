import { useLocalStorage } from './QueryDevToolsPanel/temp';
import { DevToolsContent } from './DevToolsContent';
import { DevToolsButton } from './DevToolsButton';
import { DevToolsProvider } from './devtools.context';
import { QueryDevTools } from './QueryDevTools';
import { TestDevTools } from './TestDevTools';

export function DevTools() {
  const [isOpen, setIsOpen] = useLocalStorage(
    'zougui.devtools.isOpen',
    !false,
  );

  return (
    <DevToolsProvider>
      <QueryDevTools />
      <TestDevTools />

      <DevToolsButton isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />
      {isOpen && <DevToolsContent />}
    </DevToolsProvider>
  );
}
