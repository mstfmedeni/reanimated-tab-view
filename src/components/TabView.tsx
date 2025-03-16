import React, {
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { View, StyleSheet } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import TabViewCarousel, {
  type CarouselImperativeHandle,
} from './TabViewCarousel';
import {
  type TabViewImperativeHandle,
  type TabViewProps,
} from '../types/TabView';
import type { LayoutChangeEvent } from 'react-native';
import type { Layout } from '../types/common';
import { TabBar } from './TabBar';
import { TabLayoutContextProvider } from '../providers/TabLayout';
import {
  InternalContextProvider,
  useInternalContext,
} from '../providers/Internal';
import { PropsContextProvider, usePropsContext } from '../providers/Props';
import { SCROLLABLE_TAB_WIDTH } from '../constants/tabBar';
import useHandleIndexChange from '../hooks/useHandlerIndexChange';

type TabViewWithoutProvidersProps = {
  TabViewHeaderComponent?: React.ReactNode;
};
export const TabViewWithoutProviders = React.memo<TabViewWithoutProvidersProps>(
  ({ TabViewHeaderComponent }) => {
    const { tabBarPosition, tabBarStyle, tabStyle, renderTabBar } =
      usePropsContext();

    const {
      tabViewLayout,
      tabViewCarouselRef,
      setTabViewLayout,
      setTabViewHeaderLayout,
    } = useInternalContext();

    //#region styles
    const containerLayoutStyle = useMemo(() => {
      const width: number | `${number}%` = tabViewLayout?.width || '100%';
      return { width };
    }, [tabViewLayout]);
    //#endregion

    //#region hooks
    useHandleIndexChange();
    //#endregion

    //#region callbacks
    const onTabViewLayout = useCallback(
      ({ nativeEvent }: LayoutChangeEvent) => {
        const { width, height } = nativeEvent.layout;
        setTabViewLayout((prevLayout) => ({
          ...prevLayout,
          width,
          height,
        }));
      },
      [setTabViewLayout]
    );

    const onTabViewHeaderLayout = useCallback(
      ({ nativeEvent }: LayoutChangeEvent) => {
        const { width, height } = nativeEvent.layout;
        setTabViewHeaderLayout((prevLayout) => ({
          ...prevLayout,
          width,
          height,
        }));
      },
      [setTabViewHeaderLayout]
    );
    //#endregion

    //#region render memos
    const tabBar = useMemo(() => {
      if (renderTabBar) {
        return renderTabBar({
          getLabelText: (scene) => scene.route.title,
          tabStyle,
          style: tabBarStyle,
        });
      }
      return (
        <TabBar
          getLabelText={(scene) => scene.route.title}
          tabStyle={tabStyle}
          style={tabBarStyle}
        />
      );
    }, [renderTabBar, tabStyle, tabBarStyle]);
    //#endregion

    //#region render
    return (
      <View
        style={[styles.container, containerLayoutStyle]}
        onLayout={onTabViewLayout}
      >
        <View onLayout={onTabViewHeaderLayout}>{TabViewHeaderComponent}</View>
        <View style={styles.content}>
          {tabBarPosition === 'top' && tabBar}
          <TabViewCarousel ref={tabViewCarouselRef} />
          {tabBarPosition === 'bottom' && tabBar}
        </View>
      </View>
    );
    //#endregion
  }
);

export const TabView = React.memo<TabViewProps>(
  React.forwardRef<TabViewImperativeHandle, TabViewProps>((props, ref) => {
    //#region props
    const {
      navigationState,
      initialLayout,
      animatedRouteIndex: providedAnimatedRouteIndexSV,
      sceneContainerStyle,
      keyboardDismissMode = 'auto',
      swipeEnabled = true,
      renderMode = 'all',
      tabBarConfig,
      jumpMode = 'smooth',
      sceneContainerGap = 0,
      TabViewHeaderComponent,
      renderScene,
      onIndexChange,
      onSwipeEnd,
      onSwipeStart,
    } = props;

    const {
      tabBarType = 'secondary',
      tabBarPosition = 'top',
      tabBarScrollEnabled = false,
      tabBarDynamicWidthEnabled: _tabBarDynamicWidthEnabled,
      scrollableTabWidth = SCROLLABLE_TAB_WIDTH,
      tabBarStyle,
      tabBarIndicatorStyle,
      tabStyle,
      renderTabBar,
    } = tabBarConfig ?? {};
    //#endregion

    //#region variables
    const [tabViewLayout, setTabViewLayout] = useState<Layout>({
      width: 0,
      height: 0,
      ...initialLayout?.tabView,
    });

    const [tabViewHeaderLayout, setTabViewHeaderLayout] = useState<Layout>({
      width: initialLayout?.tabView?.width ?? 0,
      height: 0,
      ...initialLayout?.tabViewHeader,
    });

    const tabViewCarouselRef = useRef<CarouselImperativeHandle>(null);

    const animatedRouteIndex = useSharedValue(navigationState.index);

    const [initialRouteIndex] = useState(navigationState.index);
    const [currentRouteIndex, setCurrentRouteIndex] =
      useState(initialRouteIndex);

    const routes = useMemo(
      () => navigationState.routes,
      [navigationState.routes]
    );
    const noOfRoutes = routes.length;

    const tabBarDynamicWidthEnabled = useMemo(() => {
      if (_tabBarDynamicWidthEnabled !== undefined) {
        return _tabBarDynamicWidthEnabled;
      }
      if (tabBarType === 'primary') {
        return true;
      }
      return false;
    }, [_tabBarDynamicWidthEnabled, tabBarType]);
    //#endregion

    //#region handlers
    const jumpTo = useCallback((routeKey: string) => {
      tabViewCarouselRef.current?.jumpToRoute(routeKey);
    }, []);
    //#endregion

    //#region hooks
    useImperativeHandle(ref, () => ({
      jumpTo,
    }));
    //#endregion

    //#region context
    const propsContextValue = useMemo(() => {
      return {
        navigationState,
        renderMode,
        tabBarType,
        tabBarPosition,
        tabBarScrollEnabled,
        tabBarDynamicWidthEnabled,
        scrollableTabWidth,
        tabBarStyle,
        tabBarIndicatorStyle,
        tabStyle,
        swipeEnabled,
        jumpMode,
        sceneContainerGap,
        sceneContainerStyle,
        keyboardDismissMode,
        providedAnimatedRouteIndexSV,
        renderTabBar,
        renderScene,
        onIndexChange,
        onSwipeEnd,
        onSwipeStart,
      };
    }, [
      navigationState,
      renderMode,
      tabBarType,
      tabBarPosition,
      tabBarScrollEnabled,
      tabBarDynamicWidthEnabled,
      scrollableTabWidth,
      tabBarStyle,
      tabBarIndicatorStyle,
      tabStyle,
      swipeEnabled,
      jumpMode,
      sceneContainerGap,
      sceneContainerStyle,
      keyboardDismissMode,
      providedAnimatedRouteIndexSV,
      renderTabBar,
      renderScene,
      onIndexChange,
      onSwipeEnd,
      onSwipeStart,
    ]);

    const internalContextValue = useMemo(() => {
      return {
        tabViewLayout,
        tabViewHeaderLayout,
        tabViewCarouselRef,
        routes,
        noOfRoutes,
        animatedRouteIndex,
        initialRouteIndex,
        currentRouteIndex,
        setCurrentRouteIndex,
        jumpTo,
        setTabViewLayout,
        setTabViewHeaderLayout,
      };
    }, [
      tabViewLayout,
      tabViewHeaderLayout,
      tabViewCarouselRef,
      routes,
      noOfRoutes,
      animatedRouteIndex,
      currentRouteIndex,
      setCurrentRouteIndex,
      initialRouteIndex,
      jumpTo,
      setTabViewLayout,
      setTabViewHeaderLayout,
    ]);
    //#endregion

    return (
      <PropsContextProvider value={propsContextValue}>
        <InternalContextProvider value={internalContextValue}>
          <TabLayoutContextProvider>
            <TabViewWithoutProviders
              TabViewHeaderComponent={TabViewHeaderComponent}
            />
          </TabLayoutContextProvider>
        </InternalContextProvider>
      </PropsContextProvider>
    );
  })
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});
