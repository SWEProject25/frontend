export const dynamic = 'force-dynamic';

import React, { Suspense } from 'react';
import ResetPasswordClient from './ResetPasswordClient';

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div />}>
      <ResetPasswordClient />
    </Suspense>
  );
}
