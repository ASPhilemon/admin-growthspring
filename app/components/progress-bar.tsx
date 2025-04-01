// In /app/layout.tsx
'use client';

import { ProgressProvider } from '@bprogress/next/app';

export default function ProgressBar({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProgressProvider
      height="6px"
      color="#ff4b01"
      options={{ showSpinner: false }}
      shallowRouting
    >
      {children}
    </ProgressProvider>
  );
}