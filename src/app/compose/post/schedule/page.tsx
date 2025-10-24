'use client';
import XModal from '@/components/ui/hoc/XModal';
import { useState } from 'react';

export default function Page() {
  const [state, setState] = useState(true);
  return (
    <div>
      <XModal title="Schedule" isOpen={state} onClose={() => setState(false)}>
        <div></div>
      </XModal>
    </div>
  );
}
