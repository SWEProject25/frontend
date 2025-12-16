'use client';
import { ReactNode, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface XMenuState {
  menuName?: string;
  open: (name: string) => void;
  close: () => void;
  position: { top: number; left: number };
  setPosition: (position: { top: number; left: number }) => void;
}

const useXMenu = create<XMenuState>()(
  devtools((set) => ({
    menuName: '',
    position: { top: 0, left: 0 },
    setPosition: (position) => set({ position }),
    open: (name) => set({ menuName: name }),
    close: () => set({ menuName: '' }),
  }))
);

interface XMenuProps {
  children: ReactNode;
}
export default function XMenu({ children }: Readonly<XMenuProps>) {
  return <div className="relative">{children}</div>;
}

interface ButtonProp {
  children: ReactNode;
  panelHeight: number;
  name: string;
}
function Button({ panelHeight, children, name }: Readonly<ButtonProp>) {
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
      data-testid={`button-xmenu${menuName}`}
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
  maxHeight?: string;
  width: string;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  scroll?: boolean;
}
function List({
  children,
  preventScroll,
  overlayColor = 'bg-transparent',
  name,
  height,
  maxHeight,
  width,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  scroll = false,
}: ListProps) {
  const menuName = useXMenu((state) => state.menuName);
  const close = useXMenu((state) => state.close);
  const position = useXMenu((state) => state.position);
  // Close modal on scroll
  useEffect(() => {
    if (menuName !== name || menuName === '' || preventScroll || scroll) return;
    globalThis.getSelection()?.removeAllRanges();

    const handleScroll = () => {
      close();
    };

    globalThis.addEventListener('scroll', handleScroll, true); // Use capture phase
    return () => {
      globalThis.removeEventListener('scroll', handleScroll, true);
    };
  }, [menuName, name, close, preventScroll, scroll]);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      close();
    }
  };

  const handleOverlayKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (closeOnOverlayClick && (e.key === 'Enter' || e.key === ' ')) {
      if (e.target === e.currentTarget) {
        e.preventDefault();
        close();
      }
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
    if (menuName === name) {
      if (preventScroll) document.body.style.overflow = 'hidden';
      else if (scroll) document.body.style.overflow = 'scroll';
      else document.body.style.overflow = 'unset';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [preventScroll, menuName, name, scroll]);

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
      onKeyDown={handleOverlayKeyDown}
      role="dialog"
      aria-modal="true"
      tabIndex={0}
      data-testid={`overlay-xmenu${menuName}`}
    >
      <div
        ref={menuRef}
        className={`fixed z-50 ${width} ${height} ${maxHeight}  bg-black border-border border shadow-[0_0_20px_rgba(255,255,255,0.15)] rounded-2xl overflow-hidden`}
        role="document"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.body
  );
}
XMenu.Button = Button;
XMenu.List = List;

function useMenuName() {
  const menuName = useXMenu((state) => state.menuName);
  return menuName;
}
export const onClose = useXMenu.getState().close;
export { useMenuName };
