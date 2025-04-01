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
      height="4px"
      color="#2f6feb"
      options={{ showSpinner: true }}
      shallowRouting
    >
      {children}
    </ProgressProvider>
  );
}