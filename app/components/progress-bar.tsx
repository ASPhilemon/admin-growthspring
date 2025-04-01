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
      height="5px"
      color="#1E90FF"
      options={{ showSpinner: false }}
      shallowRouting
    >
      {children}
    </ProgressProvider>
  );
}