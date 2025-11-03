/**
 * Handles label click behavior for input fields
 */
export const handleLabelClick = (
  inputRef: React.RefObject<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  >
) => {
  inputRef.current?.focus();
};

/**
 * Handles password toggle click behavior
 */
export const handlePasswordToggleClick = (
  e: React.MouseEvent,
  inputRef: React.RefObject<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  >
) => {
  e.preventDefault();
  e.stopPropagation();
  inputRef.current?.focus();
};

/**
 * Handles password toggle mouse down behavior
 */
export const handlePasswordToggleMouseDown = (e: React.MouseEvent) => {
  e.preventDefault();
};
