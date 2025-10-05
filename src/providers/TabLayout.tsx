import React, { createContext, useContext } from 'react';
import { useSharedValue, type SharedValue, makeMutable } from 'react-native-reanimated';
import type {
  RouteIndexToTabBarItemWidthMap,
  RouteIndexToTabOffsetMap,
  RouteIndexToTabWidthMap,
} from '../types/TabBar';

type TabLayoutContext = {
  routeIndexToTabWidthMap: SharedValue<RouteIndexToTabWidthMap>;
  routeIndexToTabOffsetMap: SharedValue<RouteIndexToTabOffsetMap>;
  routeIndexToTabBarItemWidthMap: SharedValue<RouteIndexToTabBarItemWidthMap>;
};

const TabLayoutContext = createContext<TabLayoutContext>({
  routeIndexToTabWidthMap: makeMutable({}),
  routeIndexToTabOffsetMap: makeMutable({}),
  routeIndexToTabBarItemWidthMap: makeMutable({}),
});

export const TabLayoutContextProvider: React.FC<{ children?: React.ReactNode }> = React.memo(
  function TabLayoutContextProvider({ children }) {
    const routeIndexToTabWidthMap = useSharedValue({});
    const routeIndexToTabOffsetMap = useSharedValue({});
    const routeIndexToTabBarItemWidthMap = useSharedValue({});

    return (
      <TabLayoutContext.Provider
        value={{
          routeIndexToTabWidthMap,
          routeIndexToTabOffsetMap,
          routeIndexToTabBarItemWidthMap,
        }}
      >
        {children}
      </TabLayoutContext.Provider>
    );
  }
);

export const useTabLayoutContext = () => useContext(TabLayoutContext);
