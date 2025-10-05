import type { SharedValue } from 'react-native-reanimated';

export type Route = {
  key: string;
  title?: string;
  accessible?: boolean;
  accessibilityLabel?: string;
  testID?: string;
};

export type Scene<T extends Route = Route> = {
  route: T;
};

export type NavigationState<T extends Route = Route> = {
  index: number;
  routes: T[];
};

export type Layout = {
  width: number;
  height: number;
};

export type SceneRendererProps = {
  layout: Layout;
  animatedRouteIndex: SharedValue<number>;
  jumpTo: (key: string) => void;
};

export type TabBarType = 'primary' | 'secondary';

export type RenderMode = 'all' | 'windowed' | 'lazy';
