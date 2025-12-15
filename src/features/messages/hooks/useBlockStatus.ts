import { useMemo } from 'react';
import { useGetBlockedUsers } from '@/hooks/interactions/useBlock';
import { useAuth } from '@/features/authentication/hooks';

/**
 * Hook to check if a specific user is blocked
 * @param userId - The ID of the user to check
 * @returns Object with isBlocked status and loading state
 */
export const useIsUserBlocked = (userId?: number) => {
  const { user: currentUser } = useAuth();

  // Only fetch blocked users if we have both current user and target user
  const shouldFetch = !!currentUser?.id && !!userId;

  const {
    data: blockedUsersData,
    isLoading,
    isError,
  } = useGetBlockedUsers(
    { limit: 100, page: 1 }, // Max allowed by API is 100
    shouldFetch
  );

  const isBlocked = useMemo(() => {
    // If there's an error, no user to check, or no data, default to false (allow messaging)
    if (isError || !userId || !blockedUsersData?.data) {
      return false;
    }
    const blocked = blockedUsersData.data.some(
      (blockedUser) => blockedUser.id === userId
    );
    return blocked;
  }, [userId, blockedUsersData, isError]);

  return {
    isBlocked,
    isLoading,
  };
};
