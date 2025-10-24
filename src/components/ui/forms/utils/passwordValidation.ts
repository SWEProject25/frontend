/**
 * Validates if password and confirm password match
 * @param password - The password value
 * @param confirmPassword - The confirm password value
 * @returns Error message if passwords don't match, empty string if they match
 */
export const validatePasswordMatch = (
  password: string,
  confirmPassword: string
): string => {
  console.log(password, confirmPassword);
  // Don't show error if either field is empty
  if (!password || !confirmPassword) {
    return '';
  }

  if (password !== confirmPassword) {
    return 'Passwords do not match';
  }

  return '';
};
