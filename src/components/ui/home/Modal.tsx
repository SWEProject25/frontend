'use client';

import { useOutsideModal } from '@/components/ui/home/hooks/useOutsideModal';
import { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { create } from 'zustand';

interface ModalState {
  isOpen?: boolean;
  open: () => void;
  close: () => void;
}

const useModal = create<ModalState>()((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));

export default function Modal({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
function Window({
  bluring = true,
  children,
}: {
  bluring?: boolean;
  children: ReactNode;
}) {
  const { isOpen, close } = useModal();
  const ref = useOutsideModal(close);

  // function handleClose(e: MouseEvent<HTMLDivElement>) {}
  if (!isOpen) return null;
  return createPortal(
    <div
      className={` fixed inset-0  ${bluring ? 'bg-[rgba(91,112,131,0.4)]' : 'bg-transparent'}`}
    >
      <div ref={ref}>{children}</div>
    </div>,
    document.body
  );
}
{
}
function Button({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
Modal.Button = Button;
Modal.Window = Window;

export { useModal };
