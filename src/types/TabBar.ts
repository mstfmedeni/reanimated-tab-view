import type { ScrollViewProps } from 'react-native';
import type { Route, Scene } from './common';
import type { ViewStyle } from 'react-native';
import type { StyleProp } from 'react-native';
import type { TextStyle } from 'react-native';
import type { TabContentProps } from './TabContent';
import type { SharedValue } from 'react-native-reanimated';

export type TabBarItemProps = {
  route: Route;
  focused: boolean;
  index: number;
  activePercentage: SharedValue<number>;
};

export type TabBarProps = Omit<
  ScrollViewProps,
  'children' | 'indicatorStyle' | 'contentContainerStyle'
> & {
  activeColor?: string;
  inactiveColor?: string;
  getLabelText?: (scene: Scene) => string | undefined;
  renderTabContent?: (
    props: TabContentProps & { route: Route }
  ) => React.ReactNode;
  renderTabBarItem?: (props: TabBarItemProps) => React.ReactNode;
  onTabPress?: (scene: Scene) => void;
  onTabLongPress?: (scene: Scene) => void;
  tabContentStyle?: StyleProp<ViewStyle>;
  indicatorStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  tabStyle?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
};

export type RouteIndexToTabWidthMap = {
  [key: number]: number;
};

export type RouteIndexToTabContentWidthMap = {
  [key: number]: number;
};

export type RouteIndexToTabOffsetMap = {
  [key: number]: number;
};
