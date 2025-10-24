'use client';
import { ReactNode, useEffect, useRef } from 'react';
import { create } from 'zustand';

interface XMenuState {
  menuName?: string;
  open: (name: string) => void;
  close: () => void;
  placement: 'top' | 'bottom';
  setPlacement: (diretion: 'bottom' | 'top') => void;
}

const useXMenu = create<XMenuState>()((set) => ({
  menuName: '',
  placement: 'bottom',
  setPlacement: (direction) => set({ placement: direction }),
  open: (name) => set({ menuName: name }),
  close: () => set({ menuName: '' }),
}));

interface XMenuProps {
  children: ReactNode;
}
export default function XMenu({ children }: XMenuProps) {
  return <>{children}</>;
}

interface ButtonProp {
  children: ReactNode;
  panelHeight: number;
  name: string;
}
function Button({ panelHeight, children, name }: ButtonProp) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuName = useXMenu((state) => state.menuName);
  const open = useXMenu((state) => state.open);
  const setPlacement = useXMenu((state) => state.setPlacement);

  function handleOpenMenu() {
    if (menuName === name) return;

    const trigger = triggerRef.current?.getBoundingClientRect();
    if (!trigger) return;
    const spaceBelow = window.innerHeight - trigger.bottom;
    const spaceAbove = trigger.top;
    const margin = 8; // mt/mb-2 spacing
    if (
      spaceBelow < panelHeight + margin &&
      spaceAbove >= panelHeight + margin
    ) {
      setPlacement('top');
    } else {
      setPlacement('bottom');
    }
    open(name);
  }
  return (
    <button
      aria-label="Open the Menu"
      ref={triggerRef}
      onClick={handleOpenMenu} // open model
    >
      {children}
    </button>
  );
}

interface ListProps {
  preventScroll: boolean;
  children: ReactNode;
  customLayout?: boolean;
  overlayColor?: string;
  name: string;
  height: string;
  width: string;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
}
function List({
  children,
  preventScroll,
  customLayout = false,
  overlayColor = 'bg-transparent',
  name,
  height,
  width,
  closeOnOverlayClick = true,
  closeOnEscape = true,
}: ListProps) {
  const menuName = useXMenu((state) => state.menuName);
  const close = useXMenu((state) => state.close);
  const placement = useXMenu((state) => state.placement);
  // Close modal on scroll
  useEffect(() => {
    if (menuName !== name || menuName === '' || preventScroll) return;
    window.getSelection()?.removeAllRanges();

    const handleScroll = () => {
      close();
    };

    window.addEventListener('scroll', handleScroll, true); // Use capture phase
    return () => {
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [menuName, name, close, preventScroll]);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      close();
    }
  };
  useEffect(() => {
    if (!closeOnEscape || menuName !== name || menuName === '') return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        close();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [closeOnEscape, close, menuName, name]);

  useEffect(() => {
    if (menuName === name && preventScroll) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [preventScroll, menuName, name]);

  if (menuName !== name || menuName === '') return null;

  return (
    <>
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center  ${overlayColor}`}
        onClick={handleOverlayClick}
        role="dialog"
        aria-modal="true"
      />

      <div
        className={`absolute left-0 z-50 ${width} ${height} bg-black border-border border-[1px] shadow-[0_0_20px_rgba(255,255,255,0.15)] rounded-2xl overflow-hidden ${
          placement === 'bottom' ? 'top-full mt-2' : 'bottom-full mb-2'
        }`}
      >
        {children}
      </div>
    </>
  );
}
XMenu.Button = Button;
XMenu.List = List;

export const onClose = useXMenu.getState().close;
