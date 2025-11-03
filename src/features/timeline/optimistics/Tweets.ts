import { QueryClient } from '@tanstack/react-query';

export async function handleToggleLike(
  tweetId: number,
  queryCLient: QueryClient
) {
  await queryCLient.cancelQueries();
}
