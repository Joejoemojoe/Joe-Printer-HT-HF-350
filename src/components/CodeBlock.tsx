import React from 'react';

export function CodeBlock(props: React.HTMLAttributes<HTMLElement>) {
  return (
    <pre className="relative group not-prose overflow-x-auto rounded-lg border border-border bg-[#0d1117] p-4 text-[13px] leading-relaxed">
      <code {...props} />
    </pre>
  );
}
