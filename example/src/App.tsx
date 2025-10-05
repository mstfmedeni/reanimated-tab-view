import * as React from 'react';

import {
  Button,
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  TabView as ReanimatedTabView,
  type NavigationState,
  type SceneRendererProps as ReanimatedSceneRendererProps,
} from 'reanimated-tab-view';
import {
  TabView as TabView,
  TabBar as ReactNavigationTabBar,
  type TabBarProps,
  type Route,
  type SceneRendererProps as RNTabViewSceneRendererProps,
} from 'react-native-tab-view';
import converter from 'number-to-words';

type CustomRoute = Route & { color: string };

const randomColor = (() => {
  const randomInt = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };
  return () => {
    const h = randomInt(0, 360);
    const s = randomInt(42, 98);
    const l = randomInt(40, 90);
    return `hsl(${h},${s}%,${l}%)`;
  };
})();

const { width: windowWidth } = Dimensions.get('window');
const initialTabViewLayout = {
  width: windowWidth - 50,
};

const Scene = ({
  backgroundColor,
  text,
}: {
  backgroundColor: string;
  text: string;
}) => {
  // React.useEffect(() => {
  //   for (let i = 0; i < 100000000; i++) {}
  // }, []);
  return (
    <View style={[styles.scene, { backgroundColor }]}>
      <Text style={styles.sceneText}>{text}</Text>
    </View>
  );
};

export default function App() {
  const initialTabIndex = React.useMemo(() => 0, []);
  const [showReanimatedTabView, setShowReanimatedTabView] =
    React.useState(true);

  const toggleShowReanimatedTabView = React.useCallback(
    () => setShowReanimatedTabView((prev) => !prev),
    []
  );

  const renderTabBar = React.useCallback(
    (props: TabBarProps<CustomRoute>) => <ReactNavigationTabBar {...props} scrollEnabled />,
    []
  );

  const [navigationState, setNavigationState] = React.useState<NavigationState<CustomRoute>>(
    {
      index: initialTabIndex,
      routes: [...Array(4).keys()].map((i) => ({
        key: `${i}`,
        title: `Tab ${converter.toWords(i + 1)}`,
        color: randomColor(),
      })),
    }
  );

  const renderReanimatedScene = React.useCallback(
    (props: ReanimatedSceneRendererProps & { route: CustomRoute }) => {
      return (
        <Scene
          backgroundColor={props.route.color}
          text={`Scene ${converter.toWords(parseInt(props.route.key, 10) + 1)}`}
        />
      );
    },
    []
  );

  const renderRNTabViewScene = React.useCallback(
    (props: RNTabViewSceneRendererProps & { route: CustomRoute }) => {
      return (
        <Scene
          backgroundColor={props.route.color}
          text={`Scene ${converter.toWords(parseInt(props.route.key, 10) + 1)}`}
        />
      );
    },
    []
  );

  const handleIndexChange = React.useCallback((index: number) => {
    setNavigationState((state) => ({ ...state, index }));
  }, []);

  return (
    <GestureHandlerRootView style={styles.gestureHandlerRootView}>
      <SafeAreaView style={styles.container}>
        <Text>
          {`Rendered component: ${
            showReanimatedTabView ? 'ReanimatedTabView' : 'TabView'
          }`}
        </Text>
        <Button onPress={toggleShowReanimatedTabView} title="TOGGLE" />
        {showReanimatedTabView ? (
          <ReanimatedTabView
            onIndexChange={handleIndexChange}
            navigationState={navigationState}
            renderScene={renderReanimatedScene}
            initialLayout={initialTabViewLayout}
          />
        ) : (
          <TabView
            onIndexChange={handleIndexChange}
            navigationState={navigationState}
            renderScene={renderRNTabViewScene}
            renderTabBar={renderTabBar}
            initialLayout={initialTabViewLayout}
            style={styles.tabView}
          />
        )}
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  gestureHandlerRootView: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
  tabView: { flex: 1, width: windowWidth - 50 },
  scene: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sceneText: {
    fontSize: 18,
    marginBottom: 100,
  },
});
