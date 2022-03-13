import { CodeBlock } from '../CodeBlock';

export function StackFrameCodeBlock({ lines, startLineNumber, currentLineNumber }: StackFrameCodeBlockProps) {
  return (
    <CodeBlock
      startingLineNumber={startLineNumber}
      highlightLines={[currentLineNumber]}
    >
      {lines.join('\n')}
    </CodeBlock>
  );
}

export interface StackFrameCodeBlockProps {
  lines: string[];
  startLineNumber?: number | undefined;
  currentLineNumber?: number | undefined;
}
