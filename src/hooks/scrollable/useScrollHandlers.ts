import {
  cancelAnimation,
  type SharedValue,
} from 'react-native-reanimated';
import { useCallback } from 'react';
import { GestureSource } from '../../constants/scrollable';
import { useScrollableContext } from '../../providers/Scrollable';
import { useSceneRendererContext } from '../../providers/SceneRenderer';
import type { NativeScrollEvent } from 'react-native';

export const useScrollHandlers = (scrollYSV: SharedValue<number>) => {
  const { animatedTranslateYSV, translateYBounds, gestureSourceSV } =
    useScrollableContext();

  const { isRouteFocused } = useSceneRendererContext();

  const onBeginDrag = useCallback(() => {
    'worklet';
    if (!isRouteFocused) {
      return;
    }
    cancelAnimation(animatedTranslateYSV);
    gestureSourceSV.value = GestureSource.SCROLL;
  }, [animatedTranslateYSV, gestureSourceSV, isRouteFocused]);

  const onScroll = useCallback(
    (event: NativeScrollEvent) => {
      'worklet';
      scrollYSV.value = event.contentOffset.y;
      if (!isRouteFocused) {
        return;
      }
      if (gestureSourceSV.value === GestureSource.SCROLL) {
        animatedTranslateYSV.value = Math.min(
          Math.max(event.contentOffset.y, translateYBounds.lower),
          translateYBounds.upper
        );
      }
    },
    [animatedTranslateYSV, gestureSourceSV, translateYBounds, scrollYSV, isRouteFocused]
  );

  return { onBeginDrag, onScroll };
};
