import SyntaxHighlighter, { SyntaxHighlighterProps } from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';

import { CodeRow } from './CodeRow';
import { getRowKey } from './utils';

export function CodeBlock({ lineProps, highlightLines, ...rest }: CodeBlockProps) {
  return (
      <SyntaxHighlighter
        language="typescript"
        style={atomOneDark}
        showLineNumbers
        {...rest}
        renderer={(data: any) => {
          return data.rows.map((row: any, index: number) => (
            <CodeRow
              key={getRowKey(row) ?? index}
              row={row}
              data={data}
              highlight={highlightLines?.includes((rest.startingLineNumber ?? 1) + index)}
            />
          ))
        }}
      />
  );
}

export interface CodeBlockProps extends SyntaxHighlighterProps {
  highlightLines?: (number | undefined)[] | undefined;
}
