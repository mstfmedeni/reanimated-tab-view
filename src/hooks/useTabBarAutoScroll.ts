import type { FlatList } from 'react-native-gesture-handler';
import type { Layout } from '../types/common';
import { useCallback, type RefObject } from 'react';
import { useStateUpdatesListener } from './useStateUpdatesListener';
import { useTabLayoutContext } from '../providers/TabLayout';

type AutoScrollToRouteIndexParams = {
  shouldScrollToIndex: boolean;
  animated: boolean;
};

export const useTabBarAutoScroll = (
  flatListRef: RefObject<FlatList | null>,
  currentRouteIndex: number,
  layout: Layout
) => {
  const { routeIndexToTabWidthMapSV, routeIndexToTabOffsetMapSV } =
    useTabLayoutContext();

  const autoScrollToRouteIndex = useCallback(
    (routeIndex: number, params?: Partial<AutoScrollToRouteIndexParams>) => {
      const { animated, shouldScrollToIndex } = {
        animated: true,
        shouldScrollToIndex: false,
        ...params,
      };
      if (shouldScrollToIndex) {
        const width = routeIndexToTabWidthMapSV.value[routeIndex] ?? 0;
        const viewOffset = Math.max(0, layout.width / 2 - width / 2);
        flatListRef.current?.scrollToIndex({
          index: routeIndex,
          viewOffset,
          animated,
        });
      } else {
        let offset = routeIndexToTabOffsetMapSV.value[routeIndex] ?? 0;
        const width = routeIndexToTabWidthMapSV.value[routeIndex] ?? 0;
        offset -= layout.width / 2 - width / 2;
        // Prevent scrolling to negative offset (past the start)
        offset = Math.max(0, offset);
        flatListRef.current?.scrollToOffset({
          offset,
          animated,
        });
      }
    },
    [
      flatListRef,
      layout.width,
      routeIndexToTabOffsetMapSV.value,
      routeIndexToTabWidthMapSV.value,
    ]
  );

  useStateUpdatesListener(
    currentRouteIndex,
    useCallback(() => {
      setTimeout(() => {
        autoScrollToRouteIndex(currentRouteIndex);
      }, 500);
    }, [autoScrollToRouteIndex, currentRouteIndex])
  );

  const handleScrollToIndexFailed = useCallback(
    ({ index: routeIndex }: { index: number }) => {
      let offset = routeIndexToTabOffsetMapSV.value[routeIndex] ?? 0;
      const width = routeIndexToTabWidthMapSV.value[routeIndex] ?? 0;
      offset -= layout.width / 2 + width / 2;
      // Prevent scrolling to negative offset (past the start)
      offset = Math.max(0, offset);
      flatListRef.current?.scrollToOffset({
        offset,
      });
    },
    [
      flatListRef,
      layout.width,
      routeIndexToTabOffsetMapSV.value,
      routeIndexToTabWidthMapSV.value,
    ]
  );

  return { autoScrollToRouteIndex, handleScrollToIndexFailed };
};
