'use client';
import { ReactNode, useEffect, useRef } from 'react';
import { create } from 'zustand';
import XModal from '@/components/ui/hoc/XModal';

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
}
function List({
  children,
  preventScroll,
  customLayout = false,
  overlayColor = 'bg-transparent',
  name,
  height,
  width,
}: ListProps) {
  const menuName = useXMenu((state) => state.menuName);
  const close = useXMenu((state) => state.close);
  const placement = useXMenu((state) => state.placement);
  function handleCloseMenu(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) onClose();
  }
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
  return (
    <XModal
      overlayColor={overlayColor}
      isOpen={menuName === name}
      customLayout={customLayout}
      preventScroll={preventScroll}
      onClose={close}
    >
      <div
        onClick={handleCloseMenu}
        className={`absolute left-0 z-50 ${width} ${height} bg-black border-border border-[1px] shadow-[0_0_20px_rgba(255,255,255,0.15)] rounded-2xl overflow-hidden ${
          placement === 'bottom' ? 'top-full mt-2' : 'bottom-full mb-2'
        }`}
      >
        {children}
      </div>
    </XModal>
  );
}
XMenu.Button = Button;
XMenu.List = List;

export const onClose = useXMenu.getState().close;
