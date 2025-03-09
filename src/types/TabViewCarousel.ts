import type { SharedValue } from 'react-native-reanimated';
import type { Route, SceneRendererProps } from './common';
import type { ViewProps } from 'react-native';
import type { ViewStyle } from 'react-native';
import type { StyleProp } from 'react-native';

export type TabViewCarouselProps = Omit<ViewProps, 'children'> & {
  renderScene: (
    props: SceneRendererProps & {
      route: Route;
    }
  ) => React.ReactNode;
  sceneContainerStyle?: StyleProp<ViewStyle>;
  onSwipeStart?: () => void;
  onSwipeEnd?: () => void;
};

export interface CarouselRenderItemInfo<Item> {
  item: Item;
  index: number;
  animationValue: SharedValue<number>;
}

export type CarouselRenderItem<Item> = (
  info: CarouselRenderItemInfo<Item>
) => React.ReactElement;
