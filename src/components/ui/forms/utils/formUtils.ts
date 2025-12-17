/**
 * Handles footer link clicks for modal switching
 */
import { AuthModalType } from '../types/components';

export const handleFooterLinkClick = (
  link: { href: string },
  e: React.MouseEvent,
  onSwitchModal?: (newType: AuthModalType) => void
) => {
  e.preventDefault();

  if (link.href.startsWith('modal:')) {
    const modalType = link.href.replace('modal:', '') as AuthModalType;
    onSwitchModal?.(modalType);
  } else {
    // Handle external links
    window.open(link.href, '_blank');
  }
};

/**
 * Handles overlay click for modal closing
 */
export const handleOverlayClick = (
  e: React.MouseEvent,
  onClose: () => void
) => {
  if (e.target === e.currentTarget) {
    onClose();
  }
};

/**
 * Handles keyboard events for modal closing
 */
export const handleModalKeyDown = (
  e: React.KeyboardEvent,
  onClose: () => void
) => {
  if (e.key === 'Escape') {
    onClose();
  }
};
