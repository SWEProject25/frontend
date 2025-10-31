import { useMutation, useQueryClient } from '@tanstack/react-query';
import { timelineApi } from '../services/timelineAPi';
import { AddTweetData, AddTweetResponse } from '../types/api';
import { useActions } from '../store/useAddTweetStore';

import toasterMessage from '@/components/ui/home/ToasterMessage';
import { useMediaActions } from '@/features/media/store/useMedia';
export const TIMELINE_QUERY_KEYS = {
  ADD_TWEET: ['tweet'] as const,
};
export const useAddTweet = () => {
  const { onSuccess, startSending, seterror } = useActions();
  const queryClient = useQueryClient();
  const { clearMedia } = useMediaActions();
  return useMutation<AddTweetResponse, Error, AddTweetData>({
    mutationFn: async (tweetData) => {
      startSending();
      try {
        const response = await timelineApi.addTweet(tweetData);
        return response;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to create post';
        seterror(errorMessage);
        toasterMessage(
          ` somthing wnet wrong, but don't fret —— let's give it another shot.` +
            ' —— Error message : ' +
            errorMessage,
          'top-center',
          'error'
        );
        throw error;
      }
    },
    onSuccess: () => {
      // queryClient.invalidateQueries({ queryKey: [''] });
      onSuccess();
      clearMedia();
      toasterMessage('Your post was sent.');
    },
  });
};
