'use client';
import { ReactNode, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { create } from 'zustand';

interface XMenuState {
  menuName?: string;
  open: (name: string) => void;
  close: () => void;
  position: { top: number; left: number };
  setPosition: (position: { top: number; left: number }) => void;
}

const useXMenu = create<XMenuState>()((set) => ({
  menuName: '',
  position: { top: 0, left: 0 },
  setPosition: (position) => set({ position }),
  open: (name) => set({ menuName: name }),
  close: () => set({ menuName: '' }),
}));

interface XMenuProps {
  children: ReactNode;
}
export default function XMenu({ children }: XMenuProps) {
  return <div className="relative">{children}</div>;
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
  const setPosition = useXMenu((state) => state.setPosition);

  function handleOpenMenu() {
    if (menuName === name) return;

    const trigger = triggerRef.current?.getBoundingClientRect();
    if (!trigger) return;
    const spaceBelow = window.innerHeight - trigger.bottom;
    const spaceAbove = trigger.top;
    const margin = 8;

    let top: number;
    if (
      spaceBelow < panelHeight + margin &&
      spaceAbove >= panelHeight + margin
    ) {
      // Position above the button
      top = trigger.top - panelHeight - margin;
    } else {
      // Position below the button
      top = trigger.bottom + margin;
    }

    const left = trigger.left;
    setPosition({ top, left });
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
  overlayColor = 'bg-transparent',
  name,
  height,
  width,
  closeOnOverlayClick = true,
  closeOnEscape = true,
}: ListProps) {
  const menuName = useXMenu((state) => state.menuName);
  const close = useXMenu((state) => state.close);
  const position = useXMenu((state) => state.position);
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

  const menuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (menuRef.current) {
      menuRef.current.style.top = `${position.top}px`;
      menuRef.current.style.left = `${position.left}px`;
    }
  }, [position]);

  if (menuName !== name || menuName === '') return null;
  return createPortal(
    <div
      className={`fixed inset-0 z-50   ${overlayColor}`}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
    >
      <div
        ref={menuRef}
        className={`fixed z-50 ${width} ${height} bg-black border-border border-[1px] shadow-[0_0_20px_rgba(255,255,255,0.15)] rounded-2xl overflow-hidden`}
      >
        {children}
      </div>
    </div>,
    document.body
  );
}
XMenu.Button = Button;
XMenu.List = List;

export const onClose = useXMenu.getState().close;
