import { useState, useEffect, useCallback } from 'react';
import { useInView } from 'react-intersection-observer';

export const useInfiniteScroll = (fetchMore, hasMore) => {
  const [ref, inView] = useInView();
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const loadMore = useCallback(async () => {
    if (isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);
    await fetchMore();
    setIsLoadingMore(false);
  }, [fetchMore, hasMore, isLoadingMore]);

  useEffect(() => {
    if (inView) {
      loadMore();
    }
  }, [inView, loadMore]);

  return { ref, isLoadingMore };
};